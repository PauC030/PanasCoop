import { Link } from "react-router-dom";
import homeImage from '../assets/imageHome.jpg';
import feature1 from '../assets/feature1.jpg';
import feature2 from '../assets/feature2.jpg';
import teamImage from '../assets/team.jpg';

function HomePage() {
  return (
    <div className="bg-[#f8faf9] font-sans antialiased">

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#064349]/10 via-[#064349]/5 to-transparent z-10"></div>
        </div>
        
        <div className="max-w-7xl w-full mx-auto z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left px-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#03683E]/10 text-[#03683E] mb-4">
                Plataforma colaborativa
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="text-[#064349]">PanascOOP</span>: Innovación social colectiva
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Conectamos comunidades y fomentamos el cooperativismo social. Facilitamos la organización de proyectos colectivos y promovemos la participación ciudadana a través de la colaboración y transparencia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-[#064349] to-[#03683E] hover:from-[#03683E] hover:to-[#064349] text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center text-lg"
                >
                  Únete ahora
                </Link>
              </div>
            </div>


            
            <div className="relative h-full flex items-center justify-center">
              <div className="relative w-full max-w-xl mx-auto">
                <div className="absolute -top-6 -left-6 w-full h-full rounded-2xl bg-[#03683E]/20 -z-10"></div>
                <img 
                  src={homeImage} 
                  alt="Comunidad colaborando" 
                  className="w-full h-auto rounded-2xl shadow-2xl object-cover border-4 border-white" 
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-lg max-w-xs">
                  <div className="flex items-center mb-2">  </div>
                  <p className="text-gray-800 font-medium">"Juntos construimos el cambio que queremos ver"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  
      {/* Beneficios */}
      <section className="py-20 bg-[#f5f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#064349] mb-4">¿Por qué PanascOOP?</h2>
            <div className="inline-block h-1 w-16 bg-[#03683E] mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              La plataforma integral para gestionar proyectos comunitarios con transparencia y participación democrática.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Gestión de proyectos",
                desc: "Herramientas ágiles para planificar, ejecutar y monitorear iniciativas comunitarias.",
                icon: (
                  <svg className="w-12 h-12 text-[#03683E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                )
              },
              {
                title: "Voluntariado",
                desc: "Conecta organizaciones con voluntarios comprometidos con causas sociales.",
                icon: (
                  <svg className="w-12 h-12 text-[#03683E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                )
              },
              {
                title: "Participación democrática",
                desc: "Promover la participación democrática en las personas desde el respeto.",
                icon: (
                  <svg className="w-12 h-12 text-[#03683E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-5.679 1.168 6.065 6.065 0 00-2.852 1.759A5.986 5.986 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z"></path>
                  </svg>
                )
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-[#064349] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Características destacadas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-1">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#03683E]/10 text-[#03683E] mb-4">
                Gestión colaborativa
              </div>
              <h2 className="text-3xl font-bold text-[#064349] mb-6">Gestión ágil de proyectos comunitarios</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Ofrecemos herramientas especializadas para la planificación y ejecución de proyectos sociales, facilitando la coordinación entre organizaciones y voluntarios.
              </p>
              <ul className="space-y-4">
                {[
                  "Organización de actividades y eventos",
                  "Coordinación de equipos de trabajo",
                  "Seguimiento de objetivos y metas",
                  "Alertas y recordatorios personalizados"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-[#03683E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-2 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img src={feature1} alt="Gestión de proyectos" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064349]/30 to-transparent"></div>
              </div>  
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1 relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img src={feature2} alt="Participación ciudadana" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064349]/30 to-transparent"></div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-lg w-3/4 z-10">
                <h4 className="font-bold text-[#064349] mb-2">Participación inclusiva</h4>
                <p className="text-gray-600 text-sm">Todos los miembros pueden contribuir fácilmente</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#03683E]/10 text-[#03683E] mb-4">
                Comunidad activa
              </div>
              <h2 className="text-3xl font-bold text-[#064349] mb-6">Participación ciudadana inclusiva</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Facilitamos la participación de todos los miembros de la comunidad, independientemente de su ubicación o disponibilidad horaria, a través de herramientas digitales.
              </p>
              <ul className="space-y-4">
                {[
                  "Participación democrática",
                  "Promovemos la inclusión y el compromiso social en cada proyecto.",
                  "Espacios para compartir buenas prácticas",
                  "Sistema de búsqueda por ubicación o temática"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-[#03683E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="ml-3 text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impacto Potencial */}
      <section className="py-20 bg-[#064349] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestro Impacto Potencial</h2>
            <div className="inline-block h-1 w-16 bg-[#8dd3bb] mx-auto mb-6 rounded-full"></div>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              PanascOOP está diseñado para transformar la manera en que las organizaciones sociales gestionan sus proyectos y conectan con sus comunidades.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Para Organizaciones",
                items: [
                  "Gestión centralizada de proyectos",
                  "Mayor participación de miembros",
                  "Transparencia en recursos",
                  "Reducción de trabajo administrativo",
                  "Conexión con voluntarios"
                ],
                icon: (
                  <svg className="w-10 h-10 text-[#8dd3bb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                )
              },
              {
                title: "Para Voluntarios",
                items: [
                  "Acceso a oportunidades cercanas",
                  "Seguimiento de tu impacto",
                  "Formación continua",
                  "Red de contactos solidarios",
                  "Reconocimiento digital"
                ],
                icon: (
                  <svg className="w-10 h-10 text-[#8dd3bb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                )
              },
              {
                title: "Para Comunidades",
                items: [
                  "Proyectos más visibles",
                  "Participación inclusiva",
                  "Toma de decisiones colectiva",
                  "Uso eficiente de recursos",
                  "Fortalecimiento del tejido social"
                ],
                icon: (
                  <svg className="w-10 h-10 text-[#8dd3bb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                )
              }
            ].map((card, index) => (
              <div 
                key={index} 
                className="bg-white/10 p-8 rounded-xl backdrop-blur-sm hover:bg-white/15 transition-all hover:-translate-y-2"
              >
                <div className="mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold mb-6">{card.title}</h3>
                <ul className="space-y-3">
                  {card.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-[#8dd3bb] mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="opacity-90">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

 

      {/* Sobre nosotros */}
      <section className="py-20 bg-[#f5f9f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img src={teamImage} alt="Equipo PanascOOP" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-xs">
                <h4 className="font-bold text-[#064349] mb-2">Nuestro equipo</h4>
                <p className="text-gray-600 text-sm">Profesionales comprometidos con el desarrollo social</p>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#03683E]/10 text-[#03683E] mb-4">
                Nuestra historia
              </div>
              <h2 className="text-3xl font-bold text-[#064349] mb-6">Sobre nosotros</h2>
              <p className="text-gray-600 mb-6 text-lg">
                PanascOOP nació en 2024 como una iniciativa de un grupo de profesionales comprometidos con el desarrollo social y la economía solidaria. Creemos en el poder transformador de la colaboración y la tecnología al servicio de las comunidades.
              </p>
              <p className="text-gray-600 mb-8 text-lg">
                Nuestra misión es fortalecer el cooperativismo social a través de herramientas digitales que faciliten la organización colectiva, promuevan la transparencia y fomenten la participación ciudadana en proyectos de impacto social.
              </p>
              
              <div className="bg-white p-6 rounded-lg border-l-4 border-[#03683E] shadow-sm">
                <h3 className="font-bold text-[#064349] mb-4 text-lg">Nuestros valores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {["Cooperación", "Transparencia", "Inclusión", "Democracia", "Sostenibilidad", "Innovación"].map((value, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-[#03683E] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-700 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-24 bg-gradient-to-r from-[#064349] to-[#03683E] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para transformar tu organización?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Únete a la red de organizaciones que ya están fortaleciendo su impacto social con PanascOOP.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-[#064349] hover:bg-gray-100 px-8 py-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Comenzar ahora
            </Link>
         
          </div>
        </div>
      </section>

      {/* Footer */}
{/* Footer */}
<footer className="bg-[#022c22] text-white pt-16 pb-8">

  <div className="max-w-7xl mx-auto px-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Logo y descripción */}
      <div className="md:col-span-2">
        <div className="flex items-center mb-4">
          <span className="text-2xl font-bold bg-[#03683E] px-3 py-1 rounded-lg">PanascOOP</span>
        </div>
        <p className="text-gray-300 mb-6 max-w-md">
          Plataforma colaborativa para la innovación social colectiva. Conectamos comunidades y facilitamos la gestión de proyectos cooperativos.
        </p>
      </div>

   

      {/* Contacto */}
          <div className="flex justify-center space-x-6 text-sm"></div>
      <div>
        <h4 className="font-bold text-lg mb-4 uppercase tracking-wider">Contacto</h4>
        <address className="not-italic text-gray-300 space-y-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 text-[#8dd3bb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <a href="mailto:panascoop@gmail.com" className="hover:text-white transition-colors duration-300">
              panascoop@gmail.com
            </a>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 text-[#8dd3bb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>Popayán, Cauca, Colombia</span>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-3 mt-0.5 text-[#8dd3bb]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <a href="tel:+573001234567" className="hover:text-white transition-colors duration-300">
              +57 300 123 4567
            </a>
          </div>
        </address>
      </div>
    </div>
    
    {/* Derechos de autor */}
    <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
      <p className="mb-2">
        © {new Date().getFullYear()} PanascOOP. Todos los derechos reservados.
      </p>
   
    </div>
  </div>
</footer>
    </div>
  );
}

export default HomePage;