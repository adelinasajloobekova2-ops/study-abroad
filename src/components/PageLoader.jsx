import './PageLoader.css'

export default function PageLoader({ text = '' }) {
  return (
    <div className="page-loader">
      <div className="page-loader__inner">
        <div className="page-loader__ring">
          <span />
          <span />
          <span />
        </div>
      </div>
      {text && <p className="page-loader__text">{text}</p>}
    </div>
  )
}
