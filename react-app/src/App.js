import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUpForm from "./components/auth/SignUpForm";
import NavBar from "./components/Navigation/NavBar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Profile from "./components/UserProfile/Profile";
import { authenticate } from "./services/auth";
import DefaultHeader from "./components/Home/DefaultHeader";
import "./index.css";
import Story from "./components/Story/Story";
import CreateStory from "./components/Story/CreateStory";
import UsersList from "./components/UserProfile/UserList";
import Footer from "./components/Navigation/Footer";
import MostRecent from "./components/Home/MostRecentStories";
import GettingStarted from "./components/Home/GettingStarted";

function App() {
	const [authenticated, setAuthenticated] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		document.title = "first_draft: Home";
		(async () => {
			const user = await authenticate();
			if (!user.errors) {
				setAuthenticated(true);
			}
			setLoaded(true);
		})();
	}, []);

	if (!loaded) {
		return null;
	}

	return (
		<BrowserRouter>
			<NavBar
				setAuthenticated={setAuthenticated}
				authenticated={authenticated}
				authenticate={authenticate}
			/>

			<Switch>
				<Route path="/login" exact={true}>
					<LoginForm
						setAuthenticated={setAuthenticated}
						authenticated={authenticated}
					/>
					<ProtectedRoute
						path="/users/:userId"
						exact={true}
						authenticated={authenticated}
						setAuthenticated={setAuthenticated}
					/>
				</Route>
				<Route path="/sign-up" exact={true}>
					<SignUpForm
						authenticated={authenticated}
						setAuthenticated={setAuthenticated}
					/>
				</Route>
				<ProtectedRoute
					path="/users/:userId"
					exact={true}
					authenticated={authenticated}
				>
					<Profile authenticate={authenticate} />
					<Footer />
				</ProtectedRoute>
				<Route path="/" exact={true}>
					<DefaultHeader
						authenticated={authenticated}
						className="header"
					/>
					<GettingStarted authenticated={authenticated} />
					{authenticated ? <MostRecent /> : ""}
					<Footer />
				</Route>
				<Route path="/stories/:id">
					<Story authenticate={authenticate} />
					<Footer />
				</Route>
				<Route path="/stories">
					{authenticated ? (
						<div>
							<CreateStory authenticate={authenticate} />
							<Footer />
						</div>
					) : (
						<LoginForm
							setAuthenticated={setAuthenticated}
							authenticated={authenticated}
						/>
					)}
				</Route>
				<Route path="/users">
					<UsersList />
					<Footer />
				</Route>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
