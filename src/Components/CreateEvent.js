import {
	Button,
	Divider,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";

import React, { useEffect, useState } from "react";

const CreateEvent = ({
	createEvent,
	projectName,
	setEventName,
	error,
	eventName,
	name,
	email,
	mobile,
}) => {
	const [clientName, setClientName] = useState("");
	const [clientEmail, setClientEmail] = useState("");
	const [clientMobile, setClientMobile] = useState("");
	const [clientProject, setClientProject] = useState("");
	useEffect(() => {
		if (name == "" && email == "" && mobile == "") {
			console.log(localStorage.getItem("clientName"));
			setClientName(localStorage.getItem("clientName"));
			setClientEmail(localStorage.getItem("clientEmail"));
			setClientMobile(localStorage.getItem("clientMobile"));
			setClientProject(localStorage.getItem("projectName"));
		} else {
			setClientName(name);
			setClientEmail(email);
			setClientMobile(mobile);
			setClientProject(projectName);
		}
		console.log(name);
	}, []);
	return (
		<Stack direction="row" mt={10}>
			{console.log(projectName)}
			<Box minWidth={"60%"} mr={8}>
				<form onSubmit={createEvent}>
					<Typography variant="h6" mb={4}>
						{clientProject}
					</Typography>
					<Box>
						<TextField
							id="outlined-basic"
							label="Event Name"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FolderOpenRoundedIcon />
									</InputAdornment>
								),
							}}
							fullWidth
							value={eventName}
							onChange={(e) => setEventName(e.target.value)}
						/>
						{error && eventName === "" ? (
							<Typography sx={{ color: "red" }}>
								This field is required.
							</Typography>
						) : (
							<></>
						)}
					</Box>

					<Box m={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Button
							variant="contained"
							endIcon={<ControlPointRoundedIcon />}
							onClick={createEvent}
						>
							Create Event
						</Button>
					</Box>
				</form>
			</Box>
			<Box>
				<Typography variant="h6">Client Details</Typography>
				<Stack direction="row" mt={3}>
					<AccountCircleRoundedIcon />
					<Typography variant="p" ml={2}>
						{clientName}
					</Typography>
				</Stack>
				<Stack direction="row" mt={3}>
					<EmailRoundedIcon />
					<Typography variant="p" ml={2}>
						{clientEmail}
					</Typography>
				</Stack>
				<Stack direction="row" mt={3}>
					<PhoneAndroidRoundedIcon />
					<Typography variant="p" ml={2}>
						{clientMobile}
					</Typography>
				</Stack>
			</Box>
		</Stack>
	);
};

export default CreateEvent;
