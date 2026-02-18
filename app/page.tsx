import { redirect } from "next/navigation";

// La raíz redirige al panel (o a auth si no hay sesión, el AuthGuard lo maneja)
export default function RootPage() {
  redirect("/panel");
}
