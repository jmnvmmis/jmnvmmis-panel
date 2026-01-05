import { useEffect, useState } from 'react';

export default function Logo({ variant = 'full', className = '' }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detectar tema actual
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    // Observar cambios en el tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`inline-flex items-center gap-4 md:gap-6 ${className}`}>
      {/* Logo Icon - Perfil romano - MÁS GRANDE */}
      <div className="w-20 h-20 md:w-28 md:h-28 flex-shrink-0">
        <img
          src="/logo-jmnvmmis.png"
          alt="JM NVMMIS Logo"
          className="w-full h-full object-contain dark:invert transition-all duration-300"
        />
      </div>
      
      {/* Título y subtítulo apilados */}
      {variant === 'full' && (
        <div className="flex flex-col justify-center gap-2">
          {/* Título - MÁS GRANDE */}
          <div>
            <img
              src={isDark ? "/nombre.png" : "/nombre-oscuro.png"}
              alt="JMNVMMIS"
              className="h-14 md:h-20 w-auto object-contain transition-all duration-300"
            />
          </div>
          {/* Subtítulo simple - MÁS PEQUEÑO */}
          <span className="text-[6px] md:text-[8px] tracking-[0.25em] text-amber-800 dark:text-amber-400 font-light uppercase text-center">
            monedas · medallas · billetes · fichas
          </span>
        </div>
      )}
    </div>
  );
}
