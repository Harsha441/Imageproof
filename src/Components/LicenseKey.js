import React from "react";
import OtpInput from "react-otp-input";
import { useEffect, useState } from "react";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

const LicenseKey = () => {
	const [code, setCode] = useState("");
	const [macId, setMacId] = useState(null);
	const [run, setRun] = useState(false);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	let navigate = useNavigate();

	const get_macid = async () => {
		let mac = await window.api.getMac();
		console.log(mac);
		setMacId(mac);
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			get_macid();
		}
		if (macId == null) {
			setRun(!run);
		} else {
			checkLiences(macId);
			// log.info(`MACID: ${macId}`);
			console.log(macId);
		}
		if (macId != null) {
			checkLiences(macId);
		}
	}, [run]);

	const handleChange = (code) => {
		console.log(code, "code");
		setCode(code);
		setError(false);
	};

	const lisenseSubmit = async (e) => {
		setLoading(true);
		e.preventDefault();
		console.log(code.length);
		const d = {
			key: code,
			macId,
		};
		try {
			if (code.length < 16) {
				setError(true);
				setLoading(false);
			}
			const { data } = await axios.post(
				`https://beta.imageproof.ai/api/activate-key`,
				d
			);
			console.log(data);
			console.log(data.findedKey.macId);
			if (data.success) {
				setLoading(false);
				console.log("working");
				// swal({
				// 	title: "success",
				// 	text: data.msg,
				// 	button: "OK!",
				// 	icon: "success",
				// });
				// log.info(`License Key Verification ${data.findedKey.macId}`);
				navigate("/login", { state: data.findedKey.macId });
			} else {
				setLoading(false);
				// log.error(`License Key Verification: ${data.msg}`);
				// swal({
				// 	title: "error",
				// 	text: data.msg,
				// 	button: "OK!",
				// 	icon: "error",
				// });
			}
		} catch (error) {
			// log.error(`${error}`);
			return console.log(error);
		}
	};

	const checkLiences = async (machineId) => {
		console.log(machineId);
		const d = {
			macId: machineId,
		};
		try {
			const { data } = await axios.post(
				`https://beta.imageproof.ai/api/check-key-activation`,
				d
			);
			console.log(data);
			// mac.info();
			if (data.success) {
				// log.info(`${data.msg}`);
				navigate("/login", { state: data.findedKey.macId });
			}
		} catch (error) {
			// log.warn(`${error}`);
			return console.log(error);
		}
	};
	return (
		<div className="flex-container">
			<div className="license-container">
				<Typography variant="h5" m={4} sx={{ fontWeight: "bold" }}>
					Enter Your License Key{" "}
				</Typography>
				<form onSubmit={lisenseSubmit}>
					<OtpInput
						value={code}
						onChange={handleChange}
						numInputs={16}
						separator={<span style={{ width: "8px" }}></span>}
						isInputNum={true}
						shouldAutoFocus={true}
						inputStyle={{
							border: "1px solid #61dafb",
							borderRadius: "8px",
							width: "54px",
							height: "54px",
							fontSize: "18px",
							color: "#000",
							fontWeight: "400",
							caretColor: "blue",
						}}
						focusStyle={{
							border: "1px solid #CFD3DB",
							outline: "none",
						}}
					/>
					{error && (
						<Typography variant="p" sx={{ m: 2, color: "red" }}>
							Please fill the all Digits
						</Typography>
					)}
					<div className="submit-btn-position">
						<LoadingButton
							sx={{ m: 3 }}
							size="small"
							type="submit"
							endIcon={<SendIcon />}
							loading={loading}
							loadingPosition="end"
							variant="contained"
						>
							Submit
						</LoadingButton>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LicenseKey;
