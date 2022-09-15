import React, { useState, useEffect } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import LoadingButton from "@mui/lab/LoadingButton";
import LoginIcon from "@mui/icons-material/Login";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { useNavigate } from "react-router-dom";
import { Stack, Typography } from "@mui/material";

import axios from "axios";
import Logo from "../images/imgproof.png";
import { Box } from "@mui/system";
import Swal from "sweetalert2";
const shell = window.require("electron").shell;
const log = window.require("electron-log");
const login = log.scope("login");
const getmac = window.require("getmac");

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [macId, setMacId] = useState("");
	const [error, setError] = useState(false);

	let navigate = useNavigate();

	useEffect(() => {
		if (typeof window !== "undefined") {
			let data = getmac.default();
			console.log({ data });
			setMacId(data);
		}
	}, []);

	const subscriptionBtn = () => {
		log.info(`Subscription`);

		shell.openExternal("https://imageproof.ai/");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const d = {
			email: email,
			password: password,
			macId: macId,
		};
		console.log(d);
		if (email === "" || password === "") {
			setError(true);
			setLoading(false);
		} else {
			try {
				const { data } = await axios.post(
					`https://beta.imageproof.ai/api/login`,
					d
				);
				console.log(data);
				const photographer = JSON.stringify(data.photographer);
				if (data.success) {
					log.info(`User Detail: ${photographer}`);

					setLoading(false);
					Swal.fire({
						title: "Success",
						text: data.msg,
						button: "Ok",
						icon: "success",
					});
					navigate("/adminDashboard");
					localStorage.setItem("token", data.token);
					localStorage.setItem("user", photographer);
				} else {
					const da = JSON.stringify(d);
					log.error(`${data.msg}`);
					log.error(`${da}`);
					setLoading(false);

					if (!data.subcription) {
						Swal.fire({
							title: "Error",
							text: data.msg,
							button: "Ok!",
							icon: "error",
						});
						setTimeout(() => {
							shell.openExternal("https://imageproof.ai/");
						}, 3000);
					} else {
						Swal.fire({
							title: "Error",
							text: data.msg,
							button: "Ok!",
							icon: "error",
						});
					}
				}
			} catch (error) {
				console.log(error);
				log.error(`${error}`);
			}
		}
	};

	return (
		<Stack direction="row" sx={{ minHeight: "100vh" }}>
			<Box
				minWidth="70%"
				className="login-left-section"
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Box width="60%">
					<img
						src={Logo}
						alt="logo"
						style={{ height: "70px", marginBottom: "50px" }}
					/>
					<Typography variant="h3" fontWeight="bold" mt={3}>
						Make Your Photo Selection Process, Easier and Faster.
					</Typography>
					<Typography variant="h6" mt={4}>
						Introducing world's first AI enabled Photo Selection Application, to
						make your work easier, and help your customers select faster.
					</Typography>
				</Box>
			</Box>
			<Box minWidth="30%" alignSelf="center">
				<Box sx={{ padding: "20px" }}>
					<form onSubmit={handleSubmit}>
						<Typography variant="h4" m={1}>
							Login
						</Typography>

						<FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
							<InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
							<OutlinedInput
								id="outlined-adornment-email"
								autoFocus={true}
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								label="Email"
								required
								startAdornment={
									<InputAdornment position="start">
										<EmailIcon />
									</InputAdornment>
								}
								fullWidth
							/>
						</FormControl>
						{error && email === "" ? (
							<Typography variant="p" sx={{ color: "red", m: 2 }}>
								Please Enter Register Email id
							</Typography>
						) : (
							<></>
						)}
						<FormControl sx={{ m: 1, width: "30ch" }} variant="outlined">
							<InputLabel htmlFor="outlined-adornment-password">
								Password
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-password"
								type={showPassword ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								startAdornment={
									<InputAdornment position="start">
										<KeyIcon />
									</InputAdornment>
								}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => setShowPassword(!showPassword)}
											edge="end"
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								}
								label="Password"
								fullWidth
							/>
						</FormControl>
						{error && password === "" ? (
							<Typography variant="p" sx={{ color: "red", m: 2 }}>
								Please Enter Password
							</Typography>
						) : (
							<></>
						)}
						<Box>
							<Typography variant="p" m={2}>
								Don't have an account ?{" "}
								<Typography
									variant="p"
									sx={{
										color: "#61dafb",
										fontWeight: "bold",
										cursor: "pointer",
									}}
									onClick={subscriptionBtn}
								>
									Register
								</Typography>
							</Typography>
						</Box>
						<Box m={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
							<LoadingButton
								size="small"
								type="submit"
								endIcon={<LoginIcon />}
								loading={loading}
								loadingPosition="end"
								variant="contained"
								mr={2}
							>
								Login
							</LoadingButton>
						</Box>
					</form>
				</Box>
			</Box>
		</Stack>
	);
};

export default Login;
