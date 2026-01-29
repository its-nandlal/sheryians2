
interface ChapterLayoutProps {
    children: React.ReactNode;
    action: React.ReactNode;
}

async function ChapterLayout({children, action}: ChapterLayoutProps) {
    return (
        <>
        {children}
        {action}
        </>
    )
}

export default ChapterLayout;