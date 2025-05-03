
import { useParams, Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const LegalPage = () => {
  const { page } = useParams<{ page: string }>();
  
  // Define content based on page param
  const getPageContent = () => {
    switch (page) {
      case "terms":
        return {
          title: "Terms of Service",
          content: (
            <>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using KuroAnime, you accept and agree to be bound by the terms and provisions of this agreement.
                In addition, when using KuroAnime's particular services, you shall be subject to any posted guidelines or rules
                applicable to such services.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="mb-4">
                KuroAnime provides users with access to a collection of anime content and related resources (the "Service").
                Unless explicitly stated otherwise, any new features that augment or enhance the current Service shall be
                subject to these Terms of Service.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">3. Content</h2>
              <p className="mb-4">
                KuroAnime displays content from various sources. KuroAnime does not host any content on its servers and acts
                as an index of publicly available content. KuroAnime has no control over and assumes no responsibility for
                the content, privacy policies, or practices of any third party websites or services.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">4. Fair Use Notice</h2>
              <p className="mb-4">
                This application contains copyrighted material the use of which has not always been specifically authorized
                by the copyright owner. We are making such material available in our efforts to advance understanding of anime
                culture. We believe this constitutes a 'fair use' of any such copyrighted material.
              </p>
            </>
          ),
        };
      
      case "privacy":
        return {
          title: "Privacy Policy",
          content: (
            <>
              <h2 className="text-xl font-semibold mb-4">1. Information Collection</h2>
              <p className="mb-4">
                KuroAnime collects minimal user data required for the operation of the service. We may collect information
                such as IP addresses, browser type, and pages visited to improve our service and user experience.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">2. Use of Information</h2>
              <p className="mb-4">
                The information we collect is used to provide and improve our service, analyze usage patterns,
                and optimize user experience. We do not sell or rent your personal information to third parties.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">3. Cookies</h2>
              <p className="mb-4">
                KuroAnime may use cookies to enhance user experience. Cookies are small files stored on your device
                that help us provide certain features and analyze how you interact with our service.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">4. Third-Party Links</h2>
              <p className="mb-4">
                KuroAnime may contain links to third-party websites. We have no control over and assume no responsibility
                for the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </>
          ),
        };
      
      case "dmca":
        return {
          title: "DMCA Policy",
          content: (
            <>
              <h2 className="text-xl font-semibold mb-4">1. Copyright Respect</h2>
              <p className="mb-4">
                KuroAnime respects the intellectual property rights of others and expects its users to do the same.
                KuroAnime will respond to notices of alleged copyright infringement that comply with applicable law
                and are properly provided to us.
              </p>
              
              <h2 className="text-xl font-semibold mb-4">2. DMCA Notice</h2>
              <p className="mb-4">
                If you believe that your copyrighted work has been copied in a way that constitutes copyright
                infringement and is accessible on KuroAnime, please send a notification containing the following information:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>A physical or electronic signature of the copyright owner or person authorized to act on their behalf</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity</li>
                <li>Your contact information, including address, telephone number, and email</li>
                <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                <li>A statement that the information in the notification is accurate and, under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
              </ul>
              
              <h2 className="text-xl font-semibold mb-4">3. Counter-Notice</h2>
              <p className="mb-4">
                If you believe that your content that was removed is not infringing, or that you have authorization
                to use it from the copyright owner, you may send a counter-notice containing the following information:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your physical or electronic signature</li>
                <li>Identification of the content that has been removed and the location at which the content appeared</li>
                <li>A statement that you have a good faith belief that the content was removed as a result of mistake or misidentification</li>
                <li>Your name, address, telephone number, and email address</li>
              </ul>
            </>
          ),
        };
      
      default:
        return {
          title: "Legal Information",
          content: (
            <p>The requested legal page was not found. Please check the URL and try again.</p>
          ),
        };
    }
  };
  
  const pageContent = getPageContent();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-kuro-400 transition">Home</Link>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span>{pageContent.title}</span>
            </div>
          </div>
          
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h1 className="text-3xl font-bold mb-6">{pageContent.title}</h1>
            <div className="prose prose-invert max-w-none">
              {pageContent.content}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LegalPage;
