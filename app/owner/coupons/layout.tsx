
interface CouponLayoutProps {
    children: React.ReactNode;
    action: React.ReactNode;
}

async function CouponLayout({children, action}: CouponLayoutProps) {
    return (
        <>
        {children}
        {action}
        </>
    )
}

export default CouponLayout;