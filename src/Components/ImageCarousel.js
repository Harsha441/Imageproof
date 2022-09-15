import React from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { Carousel } from "react-bootstrap";
import { Box } from "@mui/material";

const ImageCarousel = ({ closePopupCircle, index, images, eventId }) => {
	return (
		<Box>
			<span>
				<CancelRoundedIcon
					sx={{ color: "red" }}
					className="close-icon"
					onClick={closePopupCircle}
				/>
			</span>
			<Box className="image-carousel">
				<Carousel defaultActiveIndex={index} keyboard={true}>
					{images.map((item) => {
						let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${item}`;
						return (
							<Carousel.Item>
								<img src={img} loading="lazy" alt="item" />
							</Carousel.Item>
						);
					})}
				</Carousel>
			</Box>
		</Box>
	);
};

export default ImageCarousel;
