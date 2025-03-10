import React, { useEffect, useState } from 'react';
import { fetchImages } from '../services/api';
import { Link } from 'react-router-dom';

interface Image {
    imageId: number;
    url: string;
    recommendationId: number;
}

const Home: React.FC = () => {
    const [images, setImages] = useState<Image[]>([]);

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