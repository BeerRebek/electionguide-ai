// The chat page uses ChatLayout which manages its own full-screen layout
// including its own header and sidebar — so we do NOT wrap with AppShell here.
export default function ChatRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
