import './styles.css';

export default function Button() {
  return (
    <div className="button">
        <div className="slider">
            <div className="el">
                <PerspectiveText label="Contact" />
            </div>
        </div>
    </div>
  )
}

function PerspectiveText({label}) {
    return (    
        <div className="perspectiveText">
            <p>{label}</p>
            <p>{label}</p>
        </div>
    )
}
