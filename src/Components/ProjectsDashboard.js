import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";
import AllProjects from "./AllProjects";
import CreateProject from "./CreateProject";
import { Box, Container } from "@mui/system";
import { Paper, Stack } from "@mui/material";
import CreateEvent from "./CreateEvent";
import AllEvents from "./AllEvents";
import EventImages from "./EventImages";
import UploadImages from "./UploadImages";
import Swal from "sweetalert2";

const shell = window.require("electron").shell;
const log = window.require("electron-log");
const project = log.scope("Project");
const event = log.scope("event");

export const ProjectsDashboard = () => {
	const [projectsCount, setProjectsCount] = useState("");
	const [eventName, setEventName] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [error, setError] = useState(false);
	const [projectName, setProjectName] = useState("");
	const [clientName, setClientName] = useState("");
	const [clientEmail, setClientEmail] = useState("");
	const [clientMobile, setClientMobile] = useState("");
	const [allProjects, setAllProjects] = useState([]);
	const [token, setToken] = useState("");
	const [allEvents, setAllEvents] = useState([]);
	const [projectId, setProjectId] = useState("");
	const [createProjectShow, setCreateProjectShow] = useState(true);
	const [eventsShow, setEventsShow] = useState(false);
	const [clientEventShow, setClientEventShow] = useState(false);
	const [eventImagesShow, setEventImagesShow] = useState(false);
	const [createEventShow, setCreateEventShow] = useState(false);
	const [dateShow, setDateShow] = useState("");
	const [run, setRun] = useState(false);
	const [subscriptionShow, setSubscriptionShow] = useState("");
	const [subscriptedValidity, setSubscriptedValidity] = useState("");
	const [packageTypes, setPackageTypes] = useState("");
	const [showUploadImages, setShowUploadedImages] = useState(false);

	let navigate = useNavigate();
	let location = useLocation();

	useEffect(() => {
		if (typeof window !== "undefined") {
			console.log("we are running on the client");
			let tok = localStorage.getItem("token");
			setToken(tok);
			getAllProjets(tok);
			subscription(tok);
			console.log(location.state);
			if (location.state != null) {
				if (location.state.length > 0) {
					setAllEvents(location.state);
					setCreateProjectShow(false);
					setEventsShow(true);
				}
			}
		} else {
			console.log("we are running on the server");
		}
	}, [run]);

	const leftIcon = () => {
		setCreateProjectShow(true);
		setEventsShow(false);
		setClientEventShow(false);
		setCreateEventShow(false);
	};

	const goBack = () => {
		setEventImagesShow(false);
		setEventsShow(true);
	};
	// Create Project Function
	const createProject = async (e) => {
		console.log("running");
		e.preventDefault();
		const d = {
			projectName,
			clientName,
			clientMobile,
			clientEmail,
		};
		if (
			projectName === "" ||
			clientName === "" ||
			clientEmail === " " ||
			clientMobile === ""
		) {
			setError(true);
		} else {
			if (allProjects.length > 0) {
				if (subscriptedValidity) {
					try {
						const { data } = await axios.post(
							`https://beta.imageproof.ai/api/create-project/${token}`,
							d
						);
						console.log(data.project);
						project.info();
						if (data.success) {
							log.info(`${data.msg}`);
							Swal.fire({
								title: "success",
								text: data.msg,
								button: "Ok!",
								icon: "success",
							});
							setRun(!run);
							setProjectId(data.project._id);
							setName(clientName);
							setEmail(clientEmail);
							setMobile(clientMobile);
							let u = JSON.stringify(data.project);
							log.info(`Project Created: ${u}`);
							localStorage.setItem("client", u);
							setCreateProjectShow(false);
							setCreateEventShow(true);
							setEventsShow(false);
						} else {
							log.warn(`${data.msg}`);
							Swal.fire({
								title: "error",
								text: data.msg,
								button: "Ok!",
								icon: "error",
							});
						}
					} catch (error) {
						console.log(error);
						log.warn(`${error}`);
					}
				} else {
					log.warn(`Please Subscribe to create more projects`);
					Swal.fire({
						title: "warning",
						text: "Please Subscribe to create more projects",
						icon: "warning",
						button: "OK!",
					});
					setTimeout(() => {
						shell.openExternal("https://imageproof.ai/");
					}, 3000);
				}
			} else {
				if (packageTypes !== null) {
					try {
						const { data } = await axios.post(
							`https://beta.imageproof.ai/api/create-project/${token}`,
							d
						);
						console.log(data.project);
						if (data.success) {
							log.info(`${data.msg}`);
							Swal.fire({
								title: "success",
								text: data.msg,
								button: "Ok!",
								icon: "success",
							});
							setRun(!run);
							setProjectId(data.project._id);
							setName(clientName);
							setEmail(clientEmail);
							setMobile(clientMobile);
							let u = JSON.stringify(data.project);
							log.info(`Project Created: ${u}`);
							localStorage.setItem("client", u);
							setCreateProjectShow(false);
							setCreateEventShow(true);
							setEventsShow(false);
						} else {
							log.error(`${data.msg}`);
							Swal.fire({
								title: "error",
								text: data.msg,
								button: "Ok!",
								icon: "error",
							});
						}
					} catch (error) {
						console.log(error);
						log.console.error(`${error}`);
					}
				} else {
					log.warn(`Please Subscribe to create more projects`);
					Swal.fire({
						title: "Warning",
						text: "Please Subscribe to create more projects",
						icon: "warning",
						button: "OK!",
					});
					setTimeout(() => {
						shell.openExternal("https://imageproof.ai/");
					}, 3000);
				}
			}
		}
	};

	// Get All Projects Function
	const getAllProjets = async (token) => {
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/get-all-projects/${token}`
			);
			console.log(data);
			setAllProjects(data.projects);
			console.log(data.projects);
		} catch (error) {
			console.log(error);
		}
	};

	// Get All Events
	const getAllEvents = async (project) => {
		console.log(project, "projectId");
		let id = project._id;
		setProjectId(id);
		console.log(id);
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/get-unique-project-events/${token}/${id}`
			);
			console.log(data);
			if (data.success) {
				setAllEvents(data.projectEvents);
				console.log(data.projectEvents[0]);
				let u = JSON.stringify(data.projectEvents[0]);
				localStorage.setItem("client", u);
				setDateShow(data.projectEvents[0].updatedAt);
				setCreateProjectShow(false);
				setEventsShow(true);
				setCreateEventShow(false);
			} else {
				setCreateProjectShow(false);
				setCreateEventShow(true);
				setEventsShow(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Add Event Function
	const addEvent = () => {
		console.log("first");
		setCreateProjectShow(false);
		setCreateEventShow(true);
		setEventsShow(false);
	};

	// Event Images
	const eventImageShow = (projectId) => {
		console.log(projectId);
		localStorage.setItem("projectId", projectId);
		// navigate("/eventImages", { state: allEvents });
		setEventImagesShow(true);
		// setClientEventShow(true);
	};

	//Create Event
	const createEvent = async (e) => {
		e.preventDefault();
		event.info();
		console.log(projectId);
		const d = {
			projectId,
			eventName,
		};
		console.log(d);
		if (eventName === "") {
			setError(true);
		} else {
			if (allEvents.length > 1) {
				if (subscriptedValidity) {
					try {
						const { data } = await axios.post(
							`https://beta.imageproof.ai/api/create-event/${token}`,
							d
						);
						console.log(data);
						if (data.success) {
							log.info(`${data.msg}`);
							Swal.fire({
								title: "success",
								text: data.msg,
								button: "OK!",
								icon: "success",
							});
							setShowUploadedImages(true);
							setEventImagesShow(true);
							let event = JSON.stringify(data.event);
							localStorage.setItem("event", event);
							log.info(`Event Created: ${event}`);
						} else {
							log.error(`${data.msg}`);
							Swal.fire({
								title: "Error",
								text: data.msg,
								button: "OK!",
								icon: "error",
							});
						}
					} catch (error) {
						console.log(error);
						log.error(`${error}`);
					}
				} else {
					log.warn("Please Subscribe to create more Events");
					Swal.fire({
						title: "warning",
						text: "Please Subscribe to create more Events",
						icon: "warning",
						button: "OK!",
					});
					setTimeout(() => {
						shell.openExternal("https://imageproof.ai/");
					}, 3000);
				}
			} else {
				if (packageTypes !== null) {
					try {
						const { data } = await axios.post(
							`https://beta.imageproof.ai/api/create-event/${token}`,
							d
						);
						console.log(data);
						if (data.success) {
							log.info(`${data.msg}`);
							Swal.fire({
								title: "success",
								text: data.msg,
								button: "OK!",
								icon: "success",
							});
							navigate("/upload-photos");
							let event = JSON.stringify(data.event);
							localStorage.setItem("event", event);
							log.info(`Event Created: ${event}`);
						} else {
							log.error(`${data.msg}`);
							Swal.fire({
								title: "Error",
								text: data.msg,
								button: "OK!",
								icon: "error",
							});
						}
					} catch (error) {
						console.log(error);
						log.error(`${error}`);
					}
				} else {
					log.warn("Please Subscribe to create more Events");
					Swal.fire({
						title: "Warning",
						text: "Please Subscribe to create more Events",
						icon: "warning",
						button: "OK!",
					});
					setTimeout(() => {
						shell.openExternal("https://imageproof.ai/");
					}, 3000);
				}
			}
		}
	};

	// Subscription
	const subscription = async (token) => {
		console.log(token);
		try {
			const { data } = await axios.get(
				`https://beta.imageproof.ai/api/account/${token}`
			);
			console.log(data);
			setSubscriptionShow(data);
			setPackageTypes(data.photographer.packageName);
			setSubscriptedValidity(data.photographer.subscribedValidity);
		} catch (error) {
			console.log(error);
		}
	};
	const goToUploadImages = () => {
		console.log(true);
		setEventImagesShow(false);
		setShowUploadedImages(true);
	};
	return (
		<Box sx={{ flexGrow: 1, minHeight: "80vh" }}>
			{!eventImagesShow && !showUploadImages && (
				<Stack direction="row">
					{allProjects.length >= 0 && (
						<Box minWidth={"25%"} mr={2}>
							<Paper elevation={5} sx={{ padding: "20px", height: "85vh" }}>
								<AllProjects
									allProjects={allProjects}
									getAllEvents={getAllEvents}
								/>
							</Paper>
						</Box>
					)}
					<Box minWidth={"70%"}>
						<Paper elevation={5} sx={{ padding: "20px", height: "85vh" }}>
							{createProjectShow && (
								<CreateProject
									createProject={createProject}
									projectName={projectName}
									setProjectName={setProjectName}
									error={error}
									clientName={clientName}
									setClientName={setClientName}
									clientEmail={clientEmail}
									setClientEmail={setClientEmail}
									clientMobile={clientMobile}
									setClientMobile={setClientMobile}
								/>
							)}
							{createEventShow && (
								<CreateEvent
									createEvent={createEvent}
									projectName={projectName}
									setEventName={setEventName}
									error={error}
									eventName={eventName}
									name={name}
									email={email}
									mobile={mobile}
								/>
							)}
							{eventsShow && (
								<AllEvents
									allEvents={allEvents}
									addEvent={addEvent}
									leftIcon={leftIcon}
									eventImageShow={eventImageShow}
								/>
							)}
						</Paper>
					</Box>
				</Stack>
			)}
			{eventImagesShow && !showUploadImages && (
				<EventImages goToUploadImages={goToUploadImages} goBack={goBack} />
			)}
			{showUploadImages && <UploadImages />}
		</Box>
	);
};
