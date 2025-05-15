import Slider from "react-slick";
import img1 from "../../assets/banner1.png";
import img2 from "../../assets/banner2.png";
import img3 from "../../assets/banner3.png";

const banners = [
  {
    img: img1,
    alt: "Crypto Banner 1",
  },
  {
    img: img2,
    alt: "Crypto Banner 2",
  },
  {
    img: img3,
    alt: "Crypto Banner 3",
  },
];

export default function BannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
  };

  return (
    <div className="w-full max-h-[400px] sm:max-h-[500px] overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.img}
              alt={banner.alt}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
