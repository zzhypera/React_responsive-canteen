import Brand from './Brand'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Brand />
        <p>Good food. Less waiting. Made for campus life.</p>
        <span>© {new Date().getFullYear()} Campus Canteen</span>
      </div>
    </footer>
  )
}
