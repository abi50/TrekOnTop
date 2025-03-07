import React, { useEffect, useState } from 'react';
import { fetchImages } from '../services/api';
import { Link } from 'react-router-dom';

const Home = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        const getImages = async () => {
            const data = await fetchImages();
            setImages(data);
        };
        getImages();
    }, []);

    return (
        <div>
            <h1>Welcome to Image Gallery</h1>
            <div className="image-grid">
                {images.map((img) => (
                    <div key={img.imageId} className="image-card">
                        <img src={`http://localhost:5083${img.url}`} alt="Image" width="200" />
                        <Link to={`/recommendation/${img.recommendationId}`}>
                            <button>View Details</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;










// import React, { useEffect, useState } from 'react';
// import { fetchImages } from '../services/api';

// const Home = () => {
//     const [images, setImages] = useState([]);

//     useEffect(() => {
//         const getImages = async () => {
//             const data = await fetchImages();
//             console.log("Fetched images:", data); // הדפסה לבדיקה
//             setImages(data);
//         };
//         getImages();
//     }, []);

//     return (
//         <div>
//             <h1>Welcome to Image Gallery</h1>
//             <div className="image-grid">
//                 {images.map((img) => (
//                     <img key={img.id} src={`http://localhost:5083${img.url}`} alt={img.name} width="200" />
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default Home;




