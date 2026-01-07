




interface InstructorLayoutProps {
    children: React.ReactNode;
    create: React.ReactNode;
}

async function InstructorLayout({children, create}: InstructorLayoutProps) {
    return (
        <>
        {children}
        {create}
        </>
    )
}

export default InstructorLayout;