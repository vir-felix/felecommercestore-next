import { AiOutlineTags } from "react-icons/ai";
import { MdSupportAgent } from "react-icons/md";
import { RiSecurePaymentLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";

export default function FeaturesSection() {
  return (
    <section className="features">
      <div className="features__container">
        {featureBlocks.map(({ key, Icon, title, text }) => (
          <article key={key} className="features__col">
            <div className="features__icon">
              <Icon className="features__icon-element" />
            </div>
            <h3 className="features__title">{title}</h3>
            <p className="features__text">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

const featureBlocks = [
  {
    key: "money-back",
    Icon: AiOutlineTags,
    title: (
      <>
        100% money-back <br />
        guarantee
      </>
    ),
    text: (
      <>
        We offer a <strong>100% money-back guarantee</strong> for any returns in
        the 14 days protection.
      </>
    ),
  },
  {
    key: "secure-payment",
    Icon: RiSecurePaymentLine,
    title: "secure payment",
    text: (
      <>
        <strong>All cards</strong> accepted.
      </>
    ),
  },
  {
    key: "support",
    Icon: MdSupportAgent,
    title: "online support",
    text: (
      <>
        Our customer service is <strong>available 24h</strong>.
      </>
    ),
  },
  {
    key: "fast",
    Icon: TbTruckDelivery,
    title: "fast shipping",
    text: (
      <>
        No matter where you are from, you&apos;ll have <strong>FAST</strong>{" "}
        shipping purchasing in Jones.
      </>
    ),
  },
];
