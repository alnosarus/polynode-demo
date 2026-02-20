import Hero from '../components/Hero'
import Problem from '../components/Problem'
import Solution from '../components/Solution'
import ProductShowcase from '../components/ProductShowcase'
import AppPreview from '../components/AppPreview'
import HowItWorks from '../components/HowItWorks'
import Market from '../components/Market'
import Footer from '../components/Footer'

function Index() {
  return (
    <>
      <Hero />
      <Problem />
      <Solution />
      <ProductShowcase />
      <AppPreview />
      <HowItWorks />
      <Market />
      <section className="section final-cta">
        <h2 className="cta-title">Stop reacting. Start predicting.</h2>
        <p className="cta-subtitle">
          Join the companies that see disruptions coming 24-72 hours early.
        </p>
        <a href="mailto:seth@polynode.com" className="btn btn-primary btn-lg">
          Get 3 Months Free
        </a>
      </section>
      <Footer />
    </>
  )
}

export default Index
