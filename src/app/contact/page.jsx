import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ContactBreadcrumb from "@/components/breadcrumb/contact-breadcrumb";
import ContactArea from "@/components/contact/contact-area";
import ContactMap from "@/components/contact/contact-map";
import Footer from "@/layout/footers/footer";

export const metadata = {
  title: "Shofy - Contact Page",
};

export default function ContactPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <h1 style={{position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden'}}>Contact Us - Get in Touch</h1>
      <ContactBreadcrumb />
      <ContactArea/>
      <ContactMap/>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
