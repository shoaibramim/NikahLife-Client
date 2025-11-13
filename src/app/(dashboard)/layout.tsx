const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html>
      <body>
        <main className="w-full">
          <div className="px-4">{children}</div>
        </main>
      </body>
    </html>
  );
};
export default Layout;
