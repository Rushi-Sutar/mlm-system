import React, { useRef } from "react";
import { IoAlarmSharp, IoSettings, IoBagHandle } from "react-icons/io5";
import { FaArrowsAlt, FaUndo } from "react-icons/fa";
import { FiSlack } from "react-icons/fi";
import { MdPayment } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { img1, img2, img4 } from "../assets";

const LandingPage = () => {


  const sectionStyle = {
    backgroundImage: `url(${img1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const scrollToSectionRef = useRef(null);
  const handleButtonClick = () => {
    scrollToSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      <header
        className="bg-zinc-800 text-white p-4 flex flex-col sm:flex-row justify-between items-center"
        style={{ backgroundColor: "#3AA6B9" }}
      >
        <div className="text-2xl font-bold mb-2 sm:mb-0">
          <span className="text-black">SAMARTH DAILYNEED MULTITRADE</span>
        </div>
        <div className="text-sm flex flex-col sm:flex-row justify-center items-center">
  <span className="mb-2 sm:mb-0">(+91) 940-345-6789</span>
  <span className="mb-2 sm:mb-0">| info@s1shoppy.com | </span>
  <NavLink to="/logincustomer" className="mt-2 sm:mt-0 sm:ml-4">
    <span className="bg-red-500 text-white py-2 px-4 rounded inline-block">Login</span>
  </NavLink>
</div>


      </header>

      <section
        className="relative bg-cover bg-center h-96"
        style={sectionStyle}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white p-8">
          <h1 className="text-4xl font-bold">START YOUR NEW BUSINESS TODAY</h1>
          <p className="mt-4">
            Take charge of your future by starting your own business today. Turn
            your passion into a profession and make an impact in your community.
            Don't wait—seize the opportunity to build your dreams and achieve
            financial independence. Whether it's unique products, innovative
            services, or creative solutions, now is the time to begin your
            entrepreneurial journey. Let your ambition guide you and start your
            business today.
          </p>
          <button
            className="mt-2 mb-6 bg-red-500 text-white py-2 px-4 rounded"
            onClick={handleButtonClick}
          >
            GET STARTED
          </button>
        </div>
      </section>

      <section className="py-12 text-center">
        <div className="container mx-auto flex flex-wrap justify-around">
          <div className="w-1/3 p-4 flex flex-col items-center">
            <div className="text-6xl mb-4">
              <FiSlack />
            </div>
            <h3 className="text-xl font-bold">NO TECHNICAL HASSLE</h3>
            <p>
              Enjoy effortless functionality and peace of mind with our no
              technical hassle solutions.
            </p>
          </div>
          <div className="w-1/3 p-4 flex flex-col items-center">
            <div className="text-6xl mb-4">
              <IoAlarmSharp />
            </div>
            <h3 className="text-xl font-bold">NO LIMITATIONS</h3>
            <p>
              Embrace boundless opportunities and unlimited potential—there are
              no limitations.
            </p>
          </div>
          <div className="w-1/3 p-4 flex flex-col items-center">
            <div className="text-6xl mb-4">
              <FaArrowsAlt />
            </div>
            <h3 className="text-xl font-bold">STAY FOCUSED</h3>
            <p>
              Stay focused on your goals by minimizing distractions and managing
              your time effectively.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-zinc-800 text-white py-12">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold">CREATE YOUR BUSINESS</h2>
            <p className="mt-4">
              Embark on the journey of entrepreneurship and turn your vision
              into reality. Launching your own business allows you to build
              something meaningful, shape your own future, and make a difference
              in the world. From crafting innovative products to offering
              essential services, starting a business empowers you to follow
              your passions and contribute to your community.
            </p>
            <p className="mt-4">
              Take the first step today and bring your ideas to life, fueled by
              determination and a drive for success. With dedication and
              creativity, your business can thrive, creating opportunities for
              growth and leaving a lasting impact.
            </p>
            <button className="mt-6 bg-red-500 text-white py-2 px-4 rounded">
              GET STARTED
            </button>
          </div>
          <div className="w-full md:w-1/2 p-4">
            <img
              src={img2}
              alt="Create Your Business"
              className="rounded"
            />
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold">HOW IT WORKS</h2>
          <div className="flex flex-wrap justify-center mt-8">
            <div className="w-full sm:w-1/2 md:w-1/4 p-4 items-center">
              <div className="text-6xl mb-4 flex items-center justify-center">
                <IoSettings />
              </div>
              <h3 className="text-xl font-bold">AUTOMATION</h3>
              <p>
                Automate repetitive tasks and streamline processes using tools
                like Zapier, reducing manual effort and enhancing efficiency
                across operations.
              </p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 p-4 items-center">
              <div className="text-6xl mb-4 flex items-center justify-center">
                <MdPayment />
              </div>
              <h3 className="text-xl font-bold">RECURRING PAYMENTS</h3>
              <p className="text-sm mt-2">
                Facilitate recurring payments seamlessly with automated
                scheduling, ensuring timely transactions and convenience for
                users.
              </p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 p-4 items-center">
              <div className="text-6xl mb-4 flex items-center justify-center">
                <FaUndo />
              </div>
              <h3 className="text-xl font-bold">INTUITIVE</h3>
              <p className="text-sm mt-2">
                The intuitive interface ensures ease of use, allowing users to
                navigate effortlessly and achieve their tasks efficiently.
              </p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 p-4 items-center">
              <div className="text-6xl mb-4 flex items-center justify-center">
                <IoBagHandle />
              </div>
              <h3 className="text-xl font-bold">EXTENSIBLE</h3>
              <p className="text-sm mt-2">
              Designed to be easily extended or enhanced, allowing for future growth and adaptability. 
              This ensures your system can evolve with changing requirements without significant overhauls.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-800 text-white py-12">
        <div className="container mx-auto flex flex-wrap items-center">
          <div className="w-full md:w-1/2 p-4">
            <img src={img4} alt="100% Online & Secure" />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h2 className="text-3xl font-bold">100% ONLINE & SECURE</h2>
            <p className="mt-4">
              Experience the convenience and peace of mind of our fully online
              and secure platform. Whether you're managing transactions,
              accessing data, or collaborating remotely, our robust digital
              infrastructure ensures seamless operations and protects your
              information with state-of-the-art security measures.
            </p>
            <p className="mt-4">
              Enjoy the flexibility to conduct business from anywhere, knowing
              that your privacy and data integrity are safeguarded at all times.
              Embrace the future of digital empowerment with confidence, knowing
              that our commitment to online security is unwavering.
            </p>
            <button className="mt-6 bg-red-500 text-white py-2 px-4 rounded">
              GET STARTED
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold">TESTIMONIALS</h2>
          <div className="flex flex-wrap justify-center mt-8">
            <div className="w-full sm:w-1/2 md:w-1/4 p-4">
              <p className="italic">
                "Using this platform has been a game-changer for my business.
                The tools are intuitive, and customer support is top-notch. I've
                seen a significant increase in productivity and customer
                satisfaction since I started."
              </p>
              <p className="mt-4 font-bold">ANUJ KUMAR</p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 p-4">
              <p className="italic">
                "As a freelancer, managing payments has never been easier. The
                recurring payment feature saves me time, and the interface is
                straightforward. I highly recommend it!"
              </p>
              <p className="mt-4 font-bold">DEEPAK BHOSALE</p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 p-4">
              <p className="italic">
                "I rely on this service for its reliability and automation. It
                seamlessly handles our recurring payments, freeing up valuable
                time that we can now focus on growing our business."
              </p>
              <p className="mt-4 font-bold">MANOJ PATIL</p>
            </div>
            <div className="w-full sm:w-1/2 md:w-1/4 p-4">
              <p className="italic">
                "The intuitive design of the platform makes it easy for me to
                manage client engagements. It's user-friendly and ensures that
                my clients receive prompt and accurate invoices. I couldn't ask
                for more!"
              </p>
              <p className="mt-4 font-bold">SHRETA THAKUR</p>
            </div>
          </div>
        </div>
      </section>

      {/* <section
      ref={scrollToSectionRef}
      className="bg-red-500 text-white py-12 text-center"
    >
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold">START YOUR NEW BUSINESS TODAY</h2>
        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            className="p-2 rounded md:w-full"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            className="p-2 rounded md:w-full"
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type="text"
            placeholder="City"
            name="city"
            className="p-2 rounded md:w-full"
            onChange={handleChange}
            value={formData.city}
          />
          <input
            type="text"
            placeholder="State"
            name="state"
            className="p-2 rounded md:w-full"
            onChange={handleChange}
            value={formData.state}
          />
          <input
            type="text"
            placeholder="Phone"
            name="mobile"
            className="p-2 rounded md:w-full"
            required
            onChange={handleChange}
            value={formData.mobile}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="p-2 rounded md:w-full"
            required
            onChange={handleChange}
            value={formData.email}
          />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-black text-white py-2 px-4 rounded w-full md:w-auto"
            >
              GET STARTED
            </button>
          </div>
        </form>
        {isSubmitted && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white text-black p-6 rounded shadow-lg">
              <p>Submitted Successfully</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </section> */}

      <footer className="bg-zinc-800 text-white py-4 text-center">
        <p>&copy; Copyright 2024-2025. All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default LandingPage;
