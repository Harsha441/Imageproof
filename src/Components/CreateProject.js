import {
	Button,
	Grid,
	InputAdornment,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import React from "react";

const CreateProject = ({
	createProject,
	projectName,
	setProjectName,
	error,
	clientName,
	setClientName,
	clientEmail,
	setClientEmail,
	clientMobile,
	setClientMobile,
}) => {
	return (
		<Box>
			<Typography variant="h5">Create Project</Typography>
			<Box m={4}>
				<Grid container spacing={2}>
					<Grid item xs={6}>
						<TextField
							id="outlined-basic"
							label="Project Name"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FolderOpenRoundedIcon />
									</InputAdornment>
								),
							}}
							fullWidth
							value={projectName}
							onChange={(e) => setProjectName(e.target.value)}
						/>
						{error && projectName === "" ? (
							<Typography sx={{ color: "red" }}>
								This field is required.
							</Typography>
						) : (
							<></>
						)}
					</Grid>
					<Grid item xs={6}>
						<TextField
							id="outlined-basic"
							label="Client Name"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AccountCircleRoundedIcon />
									</InputAdornment>
								),
							}}
							fullWidth
							value={clientName}
							onChange={(e) => setClientName(e.target.value)}
						/>
						{error && clientName === "" ? (
							<Typography sx={{ color: "red" }}>
								This field is required.
							</Typography>
						) : (
							<></>
						)}
					</Grid>
					<Grid item xs={6}>
						<TextField
							id="outlined-basic"
							label="Client Email"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<EmailRoundedIcon />
									</InputAdornment>
								),
							}}
							fullWidth
							value={clientEmail}
							onChange={(e) => setClientEmail(e.target.value)}
						/>
						{error && clientEmail === "" ? (
							<Typography sx={{ color: "red" }}>
								This field is required.
							</Typography>
						) : (
							<></>
						)}
					</Grid>
					<Grid item xs={6}>
						<TextField
							id="outlined-basic"
							label="Client Mobile"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<PhoneAndroidRoundedIcon />
									</InputAdornment>
								),
							}}
							fullWidth
							value={clientMobile}
							onChange={(e) => setClientMobile(e.target.value)}
						/>
						{error && clientMobile === "" ? (
							<Typography sx={{ color: "red" }}>
								This field is required.
							</Typography>
						) : (
							<></>
						)}
						{error && clientMobile.length > 10 ? (
							<Typography sx={{ color: "red" }}>
								Please Enter 10 Digits number
							</Typography>
						) : (
							<></>
						)}
					</Grid>
				</Grid>
			</Box>
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button
					variant="contained"
					endIcon={<ControlPointRoundedIcon />}
					onClick={createProject}
				>
					Create
				</Button>
			</Box>
		</Box>
	);
};

export default CreateProject;
