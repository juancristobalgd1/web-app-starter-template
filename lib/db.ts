/**
 * lib/db.ts – IndexedDB con Dexie
 * Base de datos offline. Adapta el schema a tus entidades.
 */
import Dexie, { type Table } from "dexie";

export interface BaseRecord {
  id:          string;
  createdAt:   Date;
  updatedAt:   Date;
  pendingSync?: string | null;
}

/** Ejemplo de entidad – reemplaza con tus modelos */
export interface Item extends BaseRecord {
  name:        string;
  description?: string;
  status:      "active" | "inactive";
}

/** Cola de operaciones pendientes de sync */
export interface PendingSyncOp {
  id?:         number;
  entityType:  string;
  entityId:    string;
  operation:   "create" | "update" | "delete";
  payload:     unknown;
  createdAt:   Date;
  retryCount:  number;
  lastError?:  string;
}

class AppDatabase extends Dexie {
  items!:      Table<Item>;
  pendingOps!: Table<PendingSyncOp>;

  constructor() {
    super("web-app-starter-db");
    this.version(1).stores({
      items:      "&id, name, status, createdAt",
      pendingOps: "++id, entityType, entityId, operation, createdAt",
    });
  }
}

export const db = new AppDatabase();

export async function queueSyncOp(op: Omit<PendingSyncOp, "id" | "createdAt" | "retryCount">) {
  await db.pendingOps.add({ ...op, createdAt: new Date(), retryCount: 0 });
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    const reg = await navigator.serviceWorker.ready;
    if ("sync" in reg) {
      await (reg as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register("sync-pending-ops");
    }
  }
}

export async function getPendingOps()       { return db.pendingOps.toArray(); }
export async function clearSyncOp(id: number) { await db.pendingOps.delete(id); }
