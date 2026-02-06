import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import Problem from '../components/Problem'
import CloudTransition from '../components/CloudTransition'
import Solution from '../components/Solution'
import CityScene from '../components/CityScene'
import HowItWorks from '../components/HowItWorks'
import Footer from '../components/Footer'

function Index() {
  return (
    <>
      <Hero />
      <Problem />
      <CloudTransition />
      <Solution />
      <CityScene />
      <HowItWorks />
      <section className="section explore-cta">
        <Link to="/explore" className="btn btn-primary btn-lg">
          Explore Unmatched Interface
        </Link>
      </section>
      <Footer />
    </>
  )
}

export default Index
