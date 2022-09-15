import {
	Button,
	ImageList,
	ImageListItem,
	Paper,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import PhotoAlbumRoundedIcon from "@mui/icons-material/PhotoAlbumRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import SecurityUpdateGoodRoundedIcon from "@mui/icons-material/SecurityUpdateGoodRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";

import axios from "axios";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImageCarousel from "./ImageCarousel";
import Swal from "sweetalert2";
const fs = window.require("fs");
const path = window.require("path");
const log = window.require("electron-log");
const userlog = log.scope("Client Email");
const download = log.scope("Download Image");
const accessClient = log.scope("Access to client");

const EventImages = ({ goToUploadImages, goBack }) => {
	const [project, setProject] = useState(null);
	const [images, setImages] = useState([]);
	const [token, setToken] = useState("");
	const [selectedImg, setSelectedImg] = useState([]);
	const [showSelectedImages, setShowSelectedImages] = useState(false);
	const [allImgColor, setAllImgColor] = useState(true);
	const [clientDetails, setClientDetails] = useState("");
	const [clientImgCount, setClientImgCount] = useState("");
	const [imageCarousel, setImagesCarousel] = useState(false);
	const [index, setIndex] = useState();
	const [eventId, setEventId] = useState("");
	const [selectionAccessBtn, setSelectionAccessBtn] = useState(false);
	const [value, setValue] = useState("0");
	// const [loading, setLoading] = useState(false);

	const closePopupCircle = (state) => {
		setImagesCarousel(false);
	};

	let navigate = useNavigate();
	let location = useLocation();
	const event = location.state;

	const leftIcon = () => {
		navigate("/allproject", { state: event });
	};

	useEffect(() => {
		console.log(project);
		console.log(location.state);
		if (location.state !== null) {
			// setClientDetails();
		}
	}, [project]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			console.log("we are running on the client");
			let tok = localStorage.getItem("token");
			setToken(tok);
			let pId = localStorage.getItem("projectId");
			getProject(tok, pId);
		} else {
			console.log("we are running on the server");
		}
	}, []);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleCarousel = (item) => {
		let i = images.indexOf(item);
		setIndex(i);
		setImagesCarousel(true);
	};

	// Get Project Function
	const getProject = async (tok, projectId) => {
		console.log(projectId);
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/get-unique-event/${tok}/${projectId}`
			);
			console.log(data);
			let d = JSON.stringify(data.projectEvent);
			localStorage.setItem("event", d);
			console.log(data.projectEvent.uploadedImages);
			setClientDetails(data.projectEvent);
			console.log(data.projectEvent._id);
			setEventId(data.projectEvent._id);
			if (data.projectEvent.uploadedImages != 0) {
				setImages(data.projectEvent.uploadedImages);
			}
			if (data.projectEvent.selectedImages !== 0) {
				setSelectedImg(data.projectEvent.selectedImages);
			}
			setClientImgCount(data.projectEvent);
			if (data.projectEvent.selection === false) {
				setSelectionAccessBtn(true);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Send Email to Client Function
	const sendMailtoClient = async () => {
		const clientEmail = clientDetails.clientEmail;
		const pin = clientDetails.pin;

		const d = {
			clientEmail,
			pin,
			eventId: clientDetails._id,
		};
		console.log(d);
		if (clientDetails !== null) {
			if (clientDetails.uploadedImages.length > 0) {
				try {
					console.log(token);
					const { data } = await axios.post(
						`https://beta.imageproof.ai/api/send-email-to-client/${token}`,
						d
					);
					console.log(data);
					if (data.success) {
						Swal.fire({
							title: "Success",
							text: data.msg,
							button: "Ok!",
							icon: "success",
						});
						const clientInfo = JSON.stringify(d);
						userlog.info();
						log.info(`Client Email Send Successfully: ${clientInfo}`);
					} else {
						log.error(`${data.msg}`);
						Swal.fire({
							title: "Error",
							text: data.msg,
							button: "Ok!",
							icon: "error",
						});
					}
				} catch (error) {
					console.log(error);
					log.error(`${error}`);
				}
			} else {
				Swal.fire({
					title: "Error",
					text: "Please Upload Images!",
					button: "Ok!",
					icon: "error",
				});
			}
		}
	};

	//handle Download
	const handleDownload = async () => {
		function mkdirp(dir) {
			console.log(dir);

			fs.mkdirSync(dir);
		}
		let pathArray = selectedImg[0].split("/");
		console.log(selectedImg[0].split("/"));
		let selectedImagesPath = `${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/Selected Images/`;
		console.log(
			`${pathArray[0]}/${pathArray[1]}/${pathArray[2]}/${pathArray[3]}/`
		);
		if (fs.existsSync(selectedImagesPath)) {
			fs.rmSync(selectedImagesPath, { recursive: true });
			console.log(true);
			// return true;
		}
		mkdirp(selectedImagesPath);
		selectedImg.map((image) => {
			const filePath = `${image}`;
			const fileName = path.basename(filePath);
			console.log(filePath);
			console.log(fileName);
			console.log(selectedImagesPath);
			fs.copyFile(filePath, selectedImagesPath + "/" + fileName, (err) => {
				if (err) throw err;
				console.log("Image " + fileName + " stored.");
				// At that point, store some information like the file name for later use
			});
			Swal.fire({
				titile: "Success",
				text: "Selected Image folder Downloaded",
				icon: "success",
				button: "Ok!",
			});
		});
	};

	const selectionAccess = async (eventId) => {
		try {
			const { data } = await axios.put(
				`https://beta.imageproof.ai/api/photographer/selection-access`,
				{ eventId: eventId }
			);
			console.log(data.msg);
			if (data.success) {
				Swal.fire({
					title: "Success",
					text: data.msg,
					button: "Ok!",
					icon: "success",
				});
				const d = JSON.stringify(data);
				accessClient.info();
				log.info(`Access to Client: ${d}`);
				log.info(`Client Email: ${clientDetails.clientEmail}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Stack direction="row">
			<Box minWidth={"25%"} mr={3}>
				<Paper elevation={5} sx={{ height: "85vh", padding: "10px" }}>
					<Stack direction="row" justifyContent="space-between" mt={5}>
						<Typography variant="h6">Client Details</Typography>
						{clientDetails != null && (
							<Button
								variant="contained"
								endIcon={<CloudUploadRoundedIcon />}
								onClick={goToUploadImages}
							>
								Upload
							</Button>
						)}
					</Stack>
					<Stack direction="row" mt={9}>
						<FolderRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Project Name :
						</Typography>

						<Typography>
							{clientDetails != null ? clientDetails.projectName : ""}
						</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<PhotoAlbumRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Event Name :
						</Typography>

						<Typography>
							{clientDetails != null ? clientDetails.eventName : ""}
						</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<AccountCircleRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Client Name :
						</Typography>

						<Typography>
							{clientDetails != null ? clientDetails.clientName : ""}
						</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<EmailRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Client Email :
						</Typography>

						<Typography>
							{clientDetails != null ? clientDetails.clientEmail : ""}
						</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<PhoneAndroidRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Client Mobile :
						</Typography>

						<Typography>
							{clientDetails != null ? clientDetails.clientMobile : ""}
						</Typography>
					</Stack>
					<Box mt={5} sx={{ textAlign: "center" }}>
						<Button
							variant="contained"
							endIcon={<SendRoundedIcon />}
							onClick={() => sendMailtoClient()}
						>
							Send to client email
						</Button>
						{selectionAccessBtn && (
							<Button
								variant="contained"
								endIcon={<SecurityUpdateGoodRoundedIcon />}
								onClick={() => selectionAccess(eventId)}
								sx={{ marginTop: "30px" }}
							>
								Access to client
							</Button>
						)}
					</Box>
				</Paper>
			</Box>
			<Box minWidth={"72%"}>
				<Paper elevation={5} sx={{ height: "85vh", overflow: "auto" }}>
					<Box sx={{ width: "100%" }}>
						<TabContext value={value}>
							<Box sx={{ backgroundColor: "#fcfcfc" }}>
								<Tabs value={value} onChange={handleChange} variant="fullWidth">
									<Tab
										label={
											<ArrowCircleLeftRoundedIcon
												onClick={goBack}
												sx={{ cursor: "pointer", color: "#387c8f" }}
											/>
										}
										value="0"
										onClick={() => setShowSelectedImages(false)}
									/>
									<Tab
										label={`Uploaded Images-  ${
											clientImgCount.length !== 0
												? clientImgCount.uploadedImages.length
												: ""
										}`}
										value="0"
										onClick={() => setShowSelectedImages(false)}
									/>
									<Tab
										label={`Selected Images- ${
											clientImgCount.length !== 0
												? clientImgCount.selectedImages.length
												: ""
										}`}
										value="1"
										onClick={() => setShowSelectedImages(true)}
									/>
									{showSelectedImages &&
									clientImgCount.selectedImages.length > 0 ? (
										<Tab
											label={
												<Button
													variant="contained"
													endIcon={<DownloadRoundedIcon />}
													onClick={handleDownload}
												>
													Download
												</Button>
											}
										/>
									) : (
										<></>
									)}
								</Tabs>
							</Box>
							<TabPanel value="0">
								{imageCarousel && (
									<ImageCarousel
										closePopupCircle={closePopupCircle}
										index={index}
										images={images}
										eventId={eventId}
									/>
								)}
								<Box sx={{ padding: "10px" }} className="grid-container">
									{images != null ? (
										images.map((imgId) => {
											let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${imgId}`;
											return (
												<img
													src={img}
													alt="..."
													className="get-image-page"
													loading="lazy"
													style={{ height: "auto", width: "100%" }}
													onClick={() => handleCarousel(imgId)}
												/>
											);
										})
									) : (
										<></>
									)}
								</Box>
							</TabPanel>
							<TabPanel value="1">
								<Box sx={{ padding: "10px" }} className="grid-container">
									{selectedImg.map((selectImg) => {
										let img = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${selectImg}`;
										return (
											<img
												src={img}
												className="get-image-page"
												loading="lazy"
												alt="selectImg"
												style={{ height: "auto", width: "100%" }}
											/>
										);
									})}
								</Box>
							</TabPanel>
						</TabContext>
					</Box>
				</Paper>
			</Box>
		</Stack>
	);
};

export default EventImages;
