import {
	Button,
	Grid,
	ImageList,
	ImageListItem,
	InputAdornment,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import PhotoAlbumRoundedIcon from "@mui/icons-material/PhotoAlbumRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import UploadRoundedIcon from "@mui/icons-material/UploadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import LinearProgress from "@mui/material/LinearProgress";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
const nodeDiskInfo = window.require("node-disk-info");
const fs = window.require("fs");
const path = window.require("path");
const log = window.require("electron-log");
const uploadimg = log.scope("Upload Image");

const shell = window.require("electron").shell;

const UploadImages = () => {
	const [selectedImages, setSelectedImages] = useState([]);
	const [showImages, setShowImages] = useState([]);
	const [apiImages, setApiImages] = useState([]);
	const [token, setToken] = useState("");
	const [eventId, setEventId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [clientDetail, setClientDetail] = useState([]);
	const [progress, setProgress] = useState(0);
	const [subscribeValidated, setSubscribeValidated] = useState("");
	const [diskInfo, setDiskInfo] = useState([]);
	const [allDiskInfo, setAllDiskInfo] = useState([]);
	const [showDisks, setShowDisks] = useState(false);

	let navigate = useNavigate();
	let location = useLocation();
	const event = location.state;

	const leftIcon = () => {
		navigate("/allproject");
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			console.log("we are running on the client");
			setToken(localStorage.getItem("token"));
			let event = JSON.parse(localStorage.getItem("event"));
			let tok = localStorage.getItem("token");
			console.log(tok);
			console.log(event);
			getPackageAccount(tok);
			if (event !== null) {
				console.log(event._id);
				setEventId(event._id);
			}
			let user = JSON.parse(localStorage.getItem("client"));
			console.log(user);
			if (location.state !== null) {
				getUploadPhotos(localStorage.getItem("token"), location.state);
				console.log(location.state);
			} else {
				getUploadPhotos(localStorage.getItem("token"), event._id);
			}
			if (location.state !== null) {
				setEventId(location.state);
			}
		} else {
			console.log("we are running on the server");
		}
	}, [eventId]);

	useEffect(
		() => () => {
			// Make sure to revoke the data uris to avoid memory leaks
			showImages.forEach((file) => URL.revokeObjectURL(file.preview));
		},
		[showImages]
	);

	// Image Change Function
	const imageHandleChange = (e) => {
		console.log(e.target.files);
		if (subscribeValidated == false) {
			if (e.target.files.length <= 1000) {
				const fileArray = Array.from(e.target.files).map((file) => file);
				const showImageArray = Array.from(e.target.files).map((file) =>
					URL.createObjectURL(file)
				);
				console.log(fileArray);
				setShowImages(showImageArray);
				setSelectedImages((prevIages) => prevIages.concat(fileArray));
				setShowImages((prevIages) => prevIages.concat(showImages));
				Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
			} else {
				log.warn(
					`Only 1000 images Allowed... Please Subscribe to Upload a more Images`
				);
				Swal.fire({
					title: "Warning",
					text: "Only 1000 images Allowed... Please Subscribe to Upload a more Images",
					icon: "warning",
					button: "OK!",
				});
				setTimeout(() => {
					shell.openExternal("http://imageproof.ai/");
				}, 3000);
			}
		} else {
			const fileArray = Array.from(e.target.files).map((file) => file);
			const showImageArray = Array.from(e.target.files).map((file) =>
				URL.createObjectURL(file)
			);
			console.log(fileArray);
			setShowImages(showImageArray);
			setSelectedImages((prevIages) => prevIages.concat(fileArray));
			setShowImages((prevIages) => prevIages.concat(showImages));
			Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
		}
	};

	// Checking Disk Space

	const checkDiskSpace = (e) => {
		e.preventDefault();
		console.log("disk running");
		nodeDiskInfo
			.getDiskInfo()
			.then((disks) => {
				let diskArray = [];
				setAllDiskInfo(disks);
				let l = false;
				let error = 0;
				for (const disk of disks) {
					// if (disk.mounted == "C:" && disk.available <= 30 * 1073741824) {
					diskArray.push(disk);
					l = true;
					// }
				}
				// if (!l) {
				// 	console.log("first");
				// 	// Swal.fire({
				// 	// 	title: "Warning",
				// 	// 	text: "Minimum 30GB required in any local drive",
				// 	// 	icon: "warning",
				// 	// 	button: "OK",
				// 	// });
				// }
				setDiskInfo(diskArray);
				setShowDisks(true);
			})
			.catch((reason) => {
				console.error(reason);
			});
	};

	// Select Disk

	const selectDisk = (disk) => {
		console.log(disk);
		function mkdirp(dir) {
			console.log(dir);
			if (fs.existsSync(dir)) {
				console.log(true);
				return true;
			}
			const dirname = path.dirname(dir);
			console.log(dirname);
			mkdirp(dirname);
			fs.mkdirSync(dir);
		}
		mkdirp(
			`${disk}/Imageproof/${clientDetail.projectName}/${clientDetail.eventName}/Original`
		);
		uploadToLocal(
			`${disk}/Imageproof/${clientDetail.projectName}/${clientDetail.eventName}/Original`,
			disk
		);
		const lowQuality = mkdirp(
			`${disk}/Imageproof/${clientDetail.projectName}/${clientDetail.eventName}/Thumbnail`
		);
		// lowQualityImages(
		//   `${disk}/Imageproof/${clientDetail.projectName}/${clientDetail.eventName}/Thumbnail`
		// );
	};

	// Image Upload to Local Folder

	const uploadToLocal = async (folderPath, disk) => {
		setShowDisks(false);
		let fileN;
		selectedImages.map((image) => {
			const filePath = `${image.path}`;
			const fileName = path.basename(filePath);
			console.log(filePath);
			console.log(fileName);
			console.log(folderPath);
			fs.copyFile(filePath, folderPath + "/" + fileName, (err) => {
				if (err) throw err;
				console.log("Image " + fileName + " stored.");
				// At that point, store some information like the file name for later use
			});
		});
		uploadPhotos(selectedImages, folderPath + "/");
	};

	// Upload Function
	const uploadPhotos = async (images, folderPath) => {
		// checkDiskSpace();
		console.log(folderPath);
		uploadimg.info();
		setLoading(true);
		console.log(images);
		if (images.length > 0) {
			log.info(`Photos Uploaded Successfully`);
			log.info(
				`Event Name: ${clientDetail.eventName} - Event id: ${clientDetail._id} - Project id: ${clientDetail.projectId} - Client Email:${clientDetail.clientEmail}`
			);
			for (let i = 0; i < images.length; i++) {
				const formData = new FormData();
				formData.append(`files`, images[i]);

				try {
					const { data } = await axios.put(
						`https://beta.imageproof.ai/api/upload_images/${token}/${eventId}/${folderPath}`,
						formData
					);
					if (data.success) {
						console.log(`image uploaded ${i}`);
						let p = Math.round(((i + 1) * 100) / images.length);
						log.info(`Image Uploaded: ${i + 1}`);
						setProgress(p);
						setApiImages(data.event.uploadedImages);
					}
				} catch (error) {
					console.log(error);
					log.error(`${error}`);
				}
			}
			apiImages.map((img) => {
				return log.info(`${img}`);
			});
			Swal.fire({
				title: "Success",
				text: "Images Uploaded Successfully",
				icon: "success",
				button: "OK",
			});
			setLoading(false);
			setProgress(0);
			setSelectedImages([]);
		} else {
			Swal.fire({
				title: "Error",
				text: "Please Upload a Image...!",
				icon: "error",
				button: "Ok!",
			});
			setLoading(false);
		}
	};

	// Get Upload Images Function
	const getUploadPhotos = async (tok, id) => {
		console.log(id);
		const d = {
			eventId: id,
		};
		console.log(tok, "evevt token");
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/get-unique-event/${tok}/${id}`,
				d
			);
			console.log(data);
			console.log(data.projectEvent);
			setClientDetail(data.projectEvent);
			setApiImages(data.projectEvent.uploadedImages);
		} catch (error) {
			console.log(error);
		}
	};
	// Get Account Package
	const getPackageAccount = async (tok) => {
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/account/${tok}`
			);
			console.log(data);
			setSubscribeValidated(data.photographer.subscribedValidity);
		} catch (error) {
			console.log(error);
		}
	};
	function LinearProgressWithLabel(props) {
		return (
			<Box sx={{ display: "flex", alignItems: "center" }}>
				<Box sx={{ width: "100%", mr: 1 }}>
					<LinearProgress variant="determinate" {...props} />
				</Box>
				<Box sx={{ minWidth: 35 }}>
					<Typography variant="body2" color="text.secondary">{`${Math.round(
						props.value
					)}%`}</Typography>
				</Box>
			</Box>
		);
	}
	return (
		<Stack direction="row">
			<Box minWidth={"25%"} mr={3}>
				<Paper elevation={5} sx={{ height: "85vh", padding: "10px" }}>
					<Typography variant="h6">Client Details</Typography>

					<Stack direction="row" mt={9}>
						<FolderRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Project Name :
						</Typography>

						<Typography>{clientDetail.projectName}</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<PhotoAlbumRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Event Name :
						</Typography>

						<Typography>{clientDetail.eventName}</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<AccountCircleRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Client Name :
						</Typography>

						<Typography>{clientDetail.clientName}</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<EmailRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Client Email :
						</Typography>

						<Typography>{clientDetail.clientEmail}</Typography>
					</Stack>
					<Stack direction="row" mt={4}>
						<PhoneAndroidRoundedIcon />
						<Typography mr={2} ml={2} sx={{ fontWeight: "bold" }}>
							Client Mobile :
						</Typography>

						<Typography>{clientDetail.clientMobile}</Typography>
					</Stack>
					{/* <Box mt={5} sx={{ textAlign: "center" }}>
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
					</Box> */}
				</Paper>
			</Box>
			<Box width={"72%"}>
				<Paper elevation={5} sx={{ height: "85vh", overflowX: "scroll" }}>
					<Box sx={{ padding: "20px" }} mb={3}>
						<form onSubmit={checkDiskSpace}>
							{/* <ArrowBackRoundedIcon /> */}
							<Box
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100px",
									border: "1px solid #8c8e91",
									borderRadius: "20px",
								}}
							>
								<input
									type="file"
									id="file"
									multiple
									onChange={imageHandleChange}
								/>
								<Button
									variant="contained"
									type="submit"
									endIcon={<CloudUploadRoundedIcon />}
								>
									Upload
								</Button>
							</Box>
						</form>

						{loading && (
							<Paper elevation={5} sx={{ margin: "10px" }} m={3}>
								<Box sx={{ textAlign: "center" }}>
									<LinearProgressWithLabel value={progress} />

									<Typography>Uploading Images Please wait...!</Typography>
								</Box>
							</Paper>
						)}
					</Box>

					{showDisks && (
						<Stack direction="row" justifyContent="center" mb={2}>
							{diskInfo.map((disk) => {
								return (
									<Paper
										elevation={5}
										sx={{ cursor: "pointer" }}
										onClick={() => selectDisk(disk.mounted)}
									>
										<Box m={2} sx={{ textAlign: "center" }}>
											<FolderRoundedIcon />
											<Typography variant="h6" mt={2}>
												{disk.mounted}
											</Typography>
											<LinearProgressWithLabel
												value={
													(Math.floor(disk.used / 1073741824) * 100) /
													Math.floor(disk.blocks / 1073741824)
												}
											/>
											<Typography>
												{`${Math.floor(
													disk.used / 1073741824
												)} GB / ${Math.floor(disk.blocks / 1073741824)} GB`}
											</Typography>
											<Typography>
												Available: {Math.floor(disk.available / 1073741824)} GB
											</Typography>
										</Box>
									</Paper>
								);
							})}
						</Stack>
					)}
					<Box
						className="grid-container"
						sx={{
							padding: "15px",
						}}
					>
						{apiImages.map((img) => {
							if (img !== null) {
								let imgSrc = `https://beta.imageproof.ai/api/photographer/get-images/${eventId}/${img}`;
								return (
									<Box>
										<img
											src={imgSrc}
											key={img}
											loading="lazy"
											alt="img"
											style={{ height: "auto", width: "100%" }}
										/>
									</Box>
								);
							}
						})}
					</Box>
				</Paper>
			</Box>
		</Stack>
	);
};

export default UploadImages;
