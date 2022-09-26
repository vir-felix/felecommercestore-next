import {
	RiFacebookBoxFill,
	RiInstagramFill,
	RiYoutubeFill,
	RiTwitterFill,
	RiPinterestFill
} from "react-icons/ri";

export default function SocialIcons({ vertical, size = "sm" } : { vertical?: boolean, size?: "sm" | "md" | "lg" }) {
	return (
		<div className={`social-links${(vertical ? " social-links--vertical " : " ")}social-links--${size}`}>
          <button className="social-links__link">
            <RiFacebookBoxFill />
          </button>
          <button className="social-links__link">
            <RiInstagramFill />
          </button>
          <button className="social-links__link">
            <RiYoutubeFill />
          </button>
          <button className="social-links__link">
            <RiTwitterFill />
          </button>
          <button className="social-links__link">
            <RiPinterestFill />
          </button>
        </div>
	);
};