import { Link } from "react-router-dom";
import homeImage from '../assets/imageHome.jpg';

function HomePage() {
  return (
    <section className="min-h-screen flex justify-center items-center p-6 bg-[#f8faf9]">
      <div className="max-w-7xl w-full bg-white rounded-lg shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100">
        <div className="md:flex h-full">
          <div className="p-12 md:w-1/2 flex flex-col justify-center">
            <div className="mb-2 text-sm font-semibold text-[#03683E] tracking-widest uppercase">
              Plataforma colaborativa
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="text-[#064349]">PanascOOP</span>: Innovación social colectiva
            </h1>   
            <div className="h-1 w-16 bg-[#03683E] mb-8"></div>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            PanascOOP es una plataforma que conecta comunidades y fomenta la economía solidaria.
             Facilitamos la organización de proyectos colectivos y promovemos la participación ciudadana a 
             través de la colaboración, educación y transparencia. Juntos transformamos ideas en realidades."
            </p>
            
            <div className="space-y-6 mb-10">
              {[
          {
            title: "Gestión de proyectos colectivos",
            desc: "Facilitamos la organización y ejecución de iniciativas comunitarias."
          },
          {
            title: "Participación ciudadana",
            desc: "Promovemos la inclusión y el compromiso social en cada proyecto."
          },
          {
            title: "Economía solidaria",
            desc: "Creamos redes de apoyo mutuo y comercio justo entre comunidades."
          }
        ].map((item, index) => (
          <div key={index} className="flex items-start group">
            <div className="bg-[#e8f4f0] p-2 rounded-full mr-3 mt-1 group-hover:bg-[#03683E] transition-colors">
              <svg className="w-5 h-5 text-[#064349] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-[#03683E] transition-colors">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
</div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#064349] mb-4">Nuestra filosofía</h2>
              <p className="text-gray-600 leading-relaxed">
                Creemos en la colaboración, la educación y la transparencia. Transformamos ideas en acciones colectivas, construyendo futuro con solidaridad.
              </p>
            </div>
            
            <Link
              to="/register"
              className="w-full md:w-auto bg-gradient-to-r from-[#064349] to-[#03683E] hover:from-[#03683E] hover:to-[#064349] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center relative overflow-hidden group"
            >
              <span className="relative z-10">Únete a la comunidad</span>
              <span className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all duration-500"></span>
            </Link>
          </div>
          
    
          <div className="md:w-1/2 flex items-center justify-center p-6 bg-[#f5f9f8] relative">
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <img 
                src={homeImage} 
                alt="Comunidad colaborando" 
                className="w-full h-full max-h-[600px] object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#022c22]/90 via-transparent to-transparent rounded-lg"></div>
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                <p className="text-xl font-medium drop-shadow-lg">"Juntos construimos el cambio que queremos ver"</p>
                <p className="text-sm opacity-90 drop-shadow-lg">- Comunidad PanascOOP</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 text-[#064349] px-3 py-1 rounded-full text-sm font-medium shadow">
                #ComunidadSolidaria
              </div>
            </div>
          </div>
          </div>
      </div>
    </section>
  );
}

export default HomePage