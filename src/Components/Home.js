import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, Divider, Stack, Typography } from "@mui/material";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import FolderCopyRoundedIcon from "@mui/icons-material/FolderCopyRounded";
import BurstModeRoundedIcon from "@mui/icons-material/BurstModeRounded";
import LibraryAddCheckRoundedIcon from "@mui/icons-material/LibraryAddCheckRounded";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import SmartphoneRoundedIcon from "@mui/icons-material/SmartphoneRounded";
import CameraIndoorRoundedIcon from "@mui/icons-material/CameraIndoorRounded";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import CreateNewFolderRoundedIcon from "@mui/icons-material/CreateNewFolderRounded";
import UpgradeRoundedIcon from "@mui/icons-material/UpgradeRounded";
import { Container } from "@mui/system";
import axios from "axios";
const shell = window.require("electron").shell;

const Home = ({ handleOpen }) => {
	const [projectsCount, setProjectsCount] = useState("");
	const [eventsCount, setEventsCount] = useState("");
	const [uploadedImagesCount, setUploadedImagesCount] = useState("");
	const [selectedImagesCount, setSelectedaImagesCount] = useState("");
	const [packageName, setPackageName] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [studio, setStudio] = useState("");
	const [subscriptionBtn, setSubscriptionBtn] = useState(false);

	useEffect(() => {
		let tok = localStorage.getItem("token");
		let user = JSON.parse(localStorage.getItem("user"));
		// setPhotographerDetails(user);

		console.log(tok);
		getDashboardDetails(tok);
		getPackageAccount(tok);
	}, []);

	const subscription = () => {
		shell.openExternal("https://imageproof.ai/");
	};

	const getDashboardDetails = async (tok) => {
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/get-dashboard-details/${tok}`
			);
			console.log(data);
			if (data !== undefined || data !== "undefined") {
				setProjectsCount(data.projectsCount);
				setEventsCount(data.eventsCount);
				setUploadedImagesCount(data.uploadedImagesCount);
				setSelectedaImagesCount(data.selectedImagesCount);
			}
			// setDashboardDetails(data);
		} catch (error) {
			console.log(error);
		}
	};

	const getPackageAccount = async (tok) => {
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/account/${tok}`
			);
			console.log(data);
			if (data !== undefined || data !== "undefined") {
				setName(data.photographer.name);
				setMobile(data.photographer.mobile);
				setEmail(data.photographer.email);
				setStudio(data.photographer.studioName);
				setPackageName(data.photographer.packageName);
				setEndDate(data.photographer.packageEndDate);
				if (data.photographer.packageStartDate != undefined) {
					setStartDate(data.photographer.packageStartDate);
				}
			}
			// setPackageDetails(data.photographer);
			if (data.photographer.subscribedValidity === false) {
				setSubscriptionBtn(true);
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Container sx={{ height: "100vh" }}>
			<Box sx={{ flexGrow: 1 }}>
				<Typography variant="h4">Dashboard</Typography>
				<Grid container spacing={2} mt={3}>
					<Grid item xs={3} md={3}>
						<Paper
							elevation={10}
							sx={{
								height: "150px",
								width: "250px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: "10px",
								cursor: "pointer",
							}}
							onClick={() => handleOpen("Projects")}
						>
							<Stack
								direction="row"
								spacing={5}
								sx={{ textAlign: "center", justifyContent: "space-evenly" }}
							>
								<div>
									<FolderSharedRoundedIcon sx={{ fontSize: "50px" }} />
								</div>
								<div>
									<Typography variant="h6">{projectsCount}</Typography>
									<Typography variant="p">Projects</Typography>
								</div>
							</Stack>
						</Paper>
					</Grid>
					<Grid item xs={3} md={3}>
						<Paper
							elevation={10}
							sx={{
								height: "150px",
								width: "250px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: "10px",
							}}
						>
							<Stack
								direction="row"
								spacing={5}
								sx={{ textAlign: "center", justifyContent: "space-evenly" }}
							>
								<div>
									<FolderCopyRoundedIcon sx={{ fontSize: "50px" }} />
								</div>
								<div>
									<Typography variant="h6">{eventsCount}</Typography>
									<Typography variant="p">Events</Typography>
								</div>
							</Stack>
						</Paper>
					</Grid>
					<Grid item xs={3} md={3}>
						<Paper
							elevation={10}
							sx={{
								height: "150px",
								width: "250px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: "10px",
							}}
						>
							<Stack
								direction="row"
								spacing={5}
								sx={{ textAlign: "center", justifyContent: "space-evenly" }}
							>
								<div>
									<BurstModeRoundedIcon sx={{ fontSize: "50px" }} />
								</div>
								<div>
									<Typography variant="h6">{uploadedImagesCount}</Typography>
									<Typography variant="p">Uploaded Images</Typography>
								</div>
							</Stack>
						</Paper>
					</Grid>
					<Grid item xs={3} md={3}>
						<Paper
							elevation={10}
							sx={{
								height: "150px",
								width: "250px",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: "10px",
							}}
						>
							<Stack
								direction="row"
								spacing={5}
								sx={{ textAlign: "center", justifyContent: "space-evenly" }}
							>
								<div>
									<LibraryAddCheckRoundedIcon sx={{ fontSize: "50px" }} />
								</div>
								<div>
									<Typography variant="h6">{selectedImagesCount}</Typography>
									<Typography variant="p">Selected Images</Typography>
								</div>
							</Stack>
						</Paper>
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={2} mt={5}>
					<Grid item xs={6} md={6}>
						<Paper
							elevation={10}
							sx={{
								// height: "274px",
								// width: "500px",
								borderRadius: "10px",
								padding: "20px",
							}}
						>
							<Typography variant="p" sx={{ fontWeight: "bold" }}>
								Package Information
							</Typography>
							<Divider />
							<Box mt={5}>
								<Stack
									direction="row"
									sx={{
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<InventoryRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											Package Name :
										</Typography>
									</Box>

									<Typography variant="p">{packageName}</Typography>
								</Stack>

								<Stack
									direction="row"
									mt={3}
									sx={{
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<TodayRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											Start Date :
										</Typography>
									</Box>

									<Typography variant="p">{startDate}</Typography>
								</Stack>
								<Stack
									direction="row"
									mt={3}
									sx={{
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<EventRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											End Date :
										</Typography>
									</Box>

									<Typography variant="p">{endDate}</Typography>
								</Stack>
								{subscriptionBtn && (
									<Stack
										direction="row"
										mt={2}
										sx={{
											display: "flex",
											justifyContent: "flex-end",
										}}
									>
										<Button
											variant="contained"
											endIcon={<UpgradeRoundedIcon />}
											onClick={subscription}
										>
											Subcribe
										</Button>
									</Stack>
								)}
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={6} md={6}>
						<Paper
							elevation={10}
							sx={{
								// height: "300px",
								// width: "600px",
								borderRadius: "10px",
								padding: "20px",
							}}
						>
							<Typography variant="p" sx={{ fontWeight: "bold" }}>
								Photographer Details
							</Typography>
							<Divider />
							<Box mt={5}>
								<Stack
									direction="row"
									sx={{
										alignItems: "center",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<PersonPinRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											Name :
										</Typography>
									</Box>

									<Typography variant="p" ml={5}>
										{name}
									</Typography>
								</Stack>

								<Stack
									direction="row"
									mt={3}
									sx={{
										alignItems: "center",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<MailRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											Email:
										</Typography>
									</Box>

									<Typography variant="p" ml={6}>
										{email}
									</Typography>
								</Stack>
								<Stack
									direction="row"
									mt={3}
									sx={{
										alignItems: "center",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<SmartphoneRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											Mobile :
										</Typography>
									</Box>

									<Typography variant="p" ml={4}>
										{mobile}
									</Typography>
								</Stack>
								<Stack
									direction="row"
									mt={3}
									sx={{
										alignItems: "center",
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<CameraIndoorRoundedIcon />

										<Typography variant="p" sx={{ fontWeight: "bold" }} ml={2}>
											Studio :
										</Typography>
									</Box>

									<Typography variant="p" ml={4}>
										{studio}
									</Typography>
								</Stack>
							</Box>
						</Paper>
					</Grid>
				</Grid>
			</Box>

			<SpeedDial
				ariaLabel="SpeedDial basic example"
				sx={{ position: "absolute", bottom: 60, right: 20 }}
				icon={<SpeedDialIcon />}
			>
				<SpeedDialAction
					key="New Project"
					icon={<CreateNewFolderRoundedIcon />}
					tooltipTitle="Create Project"
					onClick={() => handleOpen("Projects")}
				/>
				<SpeedDialAction
					key="Upgrade"
					icon={<UpgradeRoundedIcon />}
					tooltipTitle="Upgrade Package"
					onClick={subscription}
				/>
			</SpeedDial>
			{/* </Box> */}
		</Container>
	);
};

export default Home;
