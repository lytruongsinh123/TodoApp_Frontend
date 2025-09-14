import "./Hom.css";
import naverLogo from "../../assets/naver-logo.svg";
import hackathonGraphic from "../../assets/hackathon-graphic.svg";
import reactLogo from "../../assets/react.svg";

const Home = () => (
    <div className="home-landing">
        <nav className="home-navbar">
            <img src={naverLogo} alt="NAVER Logo" className="home-logo" />
            <img src={reactLogo} alt="NAVER Logo" className="home-logo" />
        </nav>
        <div className="home-landing-content">
            <div className="home-landing-main">
                <h1>
                    NAVER Vietnam <br />
                    <span className="ai-green">AI</span> HACKATHON
                </h1>
                <div className="home-landing-desc">
                    <p>
                        Total prize value up to <b>75,000,000 VND</b>
                        <br />
                        Internship opportunity at NAVER Vietnam
                        <br />
                        4-week training program <b>FREE</b>
                    </p>
                </div>
                <a href="/tasks" className="home-landing-btn">
                    Get Started &rarr;
                </a>
            </div>
            <div className="home-landing-graphic">
                <img src={hackathonGraphic} alt="Hackathon Graphic" />
            </div>
        </div>
    </div>
);

export default Home;
