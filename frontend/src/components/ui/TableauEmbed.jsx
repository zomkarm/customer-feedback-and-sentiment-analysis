import React, { useEffect, useRef } from "react";

const TableauEmbed = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const divElement = containerRef.current;
    const vizElement = divElement.getElementsByTagName("object")[0];

    const setVizSize = () => {
      const width = divElement.offsetWidth;
      vizElement.style.width = "100%";
      vizElement.style.height = width > 768 ? "600px" : width > 500 ? "500px" : "400px";
    };

    setVizSize();
    window.addEventListener("resize", setVizSize);

    const scriptElement = document.createElement("script");
    scriptElement.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
    vizElement.parentNode.insertBefore(scriptElement, vizElement);

    return () => {
      window.removeEventListener("resize", setVizSize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="tableauPlaceholder w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
      id="viz1748617556503"
      style={{ position: "relative" }}
    >
      <h3 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-400">
        Data analysis by Tableau
      </h3>
      <noscript>
        <a href="#">
          <img
            alt="CUSTOMER FEEDBACK ANALYSIS"
            src="https://public.tableau.com/static/images/Cu/CustomerFeedbackAnalysis_17486082401310/Dashboard1/1_rss.png"
            style={{ border: "none" }}
          />
        </a>
      </noscript>
      <object className="tableauViz" style={{ display: "none" }}>
        <param name="host_url" value="https%3A%2F%2Fpublic.tableau.com%2F" />
        <param name="embed_code_version" value="3" />
        <param name="site_root" value="" />
        <param name="name" value="CustomerFeedbackAnalysis_17486082401310/Dashboard1" />
        <param name="tabs" value="no" />
        <param name="toolbar" value="yes" />
        <param
          name="static_image"
          value="https://public.tableau.com/static/images/Cu/CustomerFeedbackAnalysis_17486082401310/Dashboard1/1.png"
        />
        <param name="animate_transition" value="yes" />
        <param name="display_static_image" value="yes" />
        <param name="display_spinner" value="yes" />
        <param name="display_overlay" value="yes" />
        <param name="display_count" value="yes" />
        <param name="language" value="en-US" />
      </object>
    </div>
  );
};

export default TableauEmbed;
