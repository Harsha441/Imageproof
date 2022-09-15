import React, { useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import logo from "../images/imgproof-white.png";
import FolderCopyRoundedIcon from "@mui/icons-material/FolderCopyRounded";
import Home from "./Home";
import { ProjectsDashboard } from "./ProjectsDashboard";

const drawerWidth = 240;

const openedMixin = (theme) => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme) => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	...(open && {
		...openedMixin(theme),
		"& .MuiDrawer-paper": openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		"& .MuiDrawer-paper": closedMixin(theme),
	}),
}));

export default function MiniDrawer() {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const [home, setHome] = useState(true);
	const [projects, setProjects] = useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleOpen = (text) => {
		if (text === "Home") {
			setHome(true);
			setProjects(false);
		}
		if (text === "Projects") {
			setHome(false);
			setProjects(true);
		}
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open} sx={{ backgroundColor: "#387c8f" }}>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={{
							marginRight: 5,
							...(open && { display: "none" }),
						}}
					>
						<MenuIcon />
					</IconButton>
					<img src={logo} alt="logo" className="logo" />
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					<ListItem key={"Home"} disablePadding sx={{ display: "block" }}>
						{!home ? (
							<ListItemButton
								sx={{
									minHeight: 50,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
									mt: 2,
									color: "#387c8f",
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : "auto",
										justifyContent: "center",
										color: "#387c8f",
									}}
									onClick={() => handleOpen("Home")}
								>
									<HomeRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={"Home"}
									sx={{ opacity: open ? 1 : 0, color: "#387c8f" }}
									onClick={() => handleOpen("Home")}
								/>
							</ListItemButton>
						) : (
							<ListItemButton
								sx={{
									minHeight: 50,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
									mt: 2,
									backgroundColor: "#387c8f",
									color: "#fff",
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : "auto",
										justifyContent: "center",
										backgroundColor: "#387c8f",
										color: "#fff",
									}}
									onClick={() => handleOpen("Home")}
								>
									<HomeRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={"Home"}
									sx={{
										opacity: open ? 1 : 0,
										backgroundColor: "#387c8f",
										color: "#fff",
									}}
									onClick={() => handleOpen("Home")}
								/>
							</ListItemButton>
						)}
					</ListItem>
					{/* <Divider /> */}
					<ListItem key={"Projects"} disablePadding sx={{ display: "block" }}>
						{!projects ? (
							<ListItemButton
								sx={{
									minHeight: 50,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
									mt: 2,
									color: "#387c8f",
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : "auto",
										justifyContent: "center",
										color: "#387c8f",
									}}
									onClick={() => handleOpen("Projects")}
								>
									<FolderCopyRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={"Projects"}
									sx={{ opacity: open ? 1 : 0, color: "#387c8f" }}
									onClick={() => handleOpen("Projects")}
								/>
							</ListItemButton>
						) : (
							<ListItemButton
								sx={{
									minHeight: 50,
									justifyContent: open ? "initial" : "center",
									px: 2.5,
									mt: 2,
									backgroundColor: "#387c8f",
									color: "#fff",
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : "auto",
										justifyContent: "center",
										backgroundColor: "#387c8f",
										color: "#fff",
									}}
									onClick={() => handleOpen("Projects")}
								>
									<FolderCopyRoundedIcon />
								</ListItemIcon>
								<ListItemText
									primary={"Projects"}
									sx={{
										opacity: open ? 1 : 0,
										backgroundColor: "#387c8f",
										color: "#fff",
									}}
									onClick={() => handleOpen("Projects")}
								/>
							</ListItemButton>
						)}
					</ListItem>
				</List>
				{/* <Divider /> */}
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<DrawerHeader />
				{home && <Home handleOpen={handleOpen} />}
				{projects && <ProjectsDashboard />}
			</Box>
		</Box>
	);
}
