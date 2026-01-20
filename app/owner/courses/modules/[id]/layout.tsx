
interface ModuleLayoutProps {
    children: React.ReactNode;
    action: React.ReactNode;
}

async function ModuleLayout({children, action}: ModuleLayoutProps) {
    return (
        <>
        {children}
        {action}
        </>
    )
}

export default ModuleLayout;