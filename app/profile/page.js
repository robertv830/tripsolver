import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8 bg-yellow-50">
        <h1 className="text-3xl font-bold mb-4 text-center text-yellow-800">
          Your Profile
        </h1>
        <p className="text-center text-yellow-700">User info will go here.</p>
      </main>
      <Footer />
    </div>
  );
}

