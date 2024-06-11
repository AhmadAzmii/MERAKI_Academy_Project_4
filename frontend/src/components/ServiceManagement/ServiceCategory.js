import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CategoryContext = createContext();

const ServiceCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/serviceCategory/");
        if (response.data.success) {
          setCategories(response.data.categories);
        } else {
          console.error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className='ServiceCategories'>
      <CategoryContext.Provider value={{ categories, setCategories }}>
      
        <div>
          {categories.map(category => (
            <div key={category.id}>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </div>
          ))}
        </div>
      </CategoryContext.Provider>
    </div>
  );
};

export default ServiceCategories;
