import Image from "next/image"
import img2 from '../../public/dashboard.png'

function Hero() {
  return (
    <section className="bg-gray-50 flex items-center flex-col">
  <div className="mx-auto max-w-screen-xl px-4 grid gap-2 md:grid-cols-2 grid-cols-1 h-screen items-center">
    <div className="mx-auto max-w-xl text-center">
      <h1 className="text-3xl font-extrabold sm:text-5xl">
        Manage Your Expenses
        <strong className="font-extrabold text-primary sm:block"> Control your Money </strong>
      </h1>

      <p className="mt-4 sm:text-xl/relaxed">
        Start creating your budget and managing your savings
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-blue focus:outline-none focus:ring active:bg-blue sm:w-auto"
          href="/sign-in"
        >
          Get Started
        </a>

        
      </div>
      
    </div>
    <Image
        src={img2}
        alt='dashboard'
        width={1000}
        height={700}
        className='-mt-9 round-xl border-2'
      />
  </div>
  
</section>
  )
}

export default Hero
