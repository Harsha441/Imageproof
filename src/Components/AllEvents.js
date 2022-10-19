import { Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ControlPointRoundedIcon from "@mui/icons-material/ControlPointRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneAndroidRoundedIcon from "@mui/icons-material/PhoneAndroidRounded";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";

import React, { useEffect, useState } from "react";

const AllEvents = ({ allEvents, addEvent, eventImageShow, leftIcon }) => {
	useEffect(() => {
		if (allEvents != undefined) {
			console.log(allEvents[0].clientName);
			localStorage.setItem("clientName", allEvents[0].clientName);
			localStorage.setItem("clientEmail", allEvents[0].clientEmail);
			localStorage.setItem("clientMobile", allEvents[0].clientMobile);
			localStorage.setItem("projectName", allEvents[0].projectName);
		}
	}, []);
	return (
		<Box>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<ArrowCircleLeftRoundedIcon
					onClick={leftIcon}
					sx={{ cursor: "pointer", color: "#387c8f" }}
				/>
				<Typography variant="h6">{allEvents[0].projectName}</Typography>
				<Button
					variant="contained"
					endIcon={<ControlPointRoundedIcon />}
					onClick={addEvent}
				>
					Add Event
				</Button>
			</Stack>
			<Stack direction="row" m={5}>
				<Box minWidth="70%" mr={5}>
					{allEvents.map((eventMap) => {
						var newDate = eventMap.createdAt.toString();
						var lastDate = new Date(newDate);
						var d = lastDate.toString();
						var resultDate = d.split(" ", 4);

						return (
							<Box
								onClick={() => eventImageShow(eventMap._id)}
								key={eventMap._id}
								sx={{
									border: "1px solid #b4b8b5",
									padding: "10px",
									borderRadius: "10px",
									cursor: "pointer",
								}}
								mt={3}
							>
								<Stack direction="row" justifyContent="space-between">
									<Typography
										sx={{
											fontWeight: "bold",
										}}
									>
										{eventMap.eventName}
									</Typography>

									<Typography>
										{resultDate[1]} /{resultDate[2]} /{resultDate[3]}
									</Typography>
								</Stack>
								<Divider />
								<Stack direction="row" justifyContent="space-around" mt={2}>
									<Typography
										sx={{
											fontWeight: "bold",
										}}
									>
										All Photos
										<Typography>{eventMap.uploadedImages.length}</Typography>
									</Typography>
									<Typography
										sx={{
											fontWeight: "bold",
										}}
									>
										Selected Photos
										<Typography>{eventMap.selectedImages.length}</Typography>
									</Typography>
								</Stack>
							</Box>
						);
					})}
				</Box>
				<Box>
					<Paper elevation={0} sx={{ padding: "30px" }}>
						<Typography variant="h6">Client Details</Typography>
						<Stack direction="row" mt={3}>
							<AccountCircleRoundedIcon />
							<Typography variant="p" ml={2}>
								{allEvents.length > 0 ? allEvents[0].clientName : ""}
							</Typography>
						</Stack>
						<Stack direction="row" mt={3}>
							<EmailRoundedIcon />
							<Typography variant="p" ml={2}>
								{allEvents.length > 0 ? allEvents[0].clientEmail : ""}
							</Typography>
						</Stack>
						<Stack direction="row" mt={3}>
							<PhoneAndroidRoundedIcon />
							<Typography variant="p" ml={2}>
								{allEvents.length > 0 ? allEvents[0].clientMobile : ""}
							</Typography>
						</Stack>
					</Paper>
				</Box>
			</Stack>
		</Box>
	);
};

export default AllEvents;
