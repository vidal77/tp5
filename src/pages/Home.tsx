import {
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	IonItem,
	IonLabel,
	IonList,
	IonPage,
	IonModal,
	IonButton,
	useIonAlert,
} from "@ionic/react";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { Toast } from "@capacitor/toast";

const Home: React.FC = () => {
	const [listItems, setListItems] = useState<any>([]);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [pokeuni, setpokeuni] = useState<any>([]);
	const [present] = useIonAlert();

	React.useEffect(() => {
		sendRequest().then((data) => {
			setListItems(data);
		});
	}, []);

	const sendRequest = () => {
		return axios
			.get("https://pokeapi.co/api/v2/pokemon?offset=20&limit=20", {
				headers: {
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				type Pokemon = {
					id: string;
					name: string;
					url: string;
				};

				let pokemons = response.data.results;
				console.log("obteniendo pokemones axios", pokemons);

				const lista: Array<Pokemon> = pokemons.map(
					(p: Pokemon, index: React.Key) => {
						return (
							<IonItem
								onClick={() => {
									axios.get(p.url).then((data) => {
										console.log(data);
										let pokeuni = data.data;
										setpokeuni(pokeuni);
									});
									setShowModal(true);
								}}
								key={p.url.split("/")[6]}
							>
								<IonLabel>{p.name}</IonLabel>
							</IonItem>
						);
					}
				);

				return lista;
			})
			.catch((error) => {
				console.log(error);
				console.log("error al consultar api");
				showToast(
					"Error al cargar los Pokemones, compruebe su conexion o intente nuevamente mas tarde"
				);
			});
	};

	const borrarPokemon = (pok: any) => {
		console.log("pok", pok);
		console.log(listItems);
		const NewArray = listItems.filter((item: any) => pok.id != item.key);
		setListItems(NewArray);
		showToast("Pokemon eliminado con exito");
	};

	const showToast = async (msg: string) => {
		await Toast.show({
			text: msg,
		});
	};

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle> TP5-PokeAPI </IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent>
				<IonModal isOpen={showModal}>
					<IonItem>
						<IonLabel className="ion-text-center ion-padding-vertical">
							<p style={{ color: "black" }}>Nombre = {pokeuni.name}</p>
							<p style={{ color: "black" }}>Peso = {pokeuni.weight}</p>
							<p style={{ color: "black" }}>
								Experiencia base = {pokeuni.base_experience}
							</p>
							<p style={{ color: "black" }}>Altura = {pokeuni.height}</p>
						</IonLabel>
					</IonItem>

					<IonButton
						onClick={() =>
							present({
								cssClass: "my-css",
								header: "Alerta",
								message: "¿Esta seguro de borrar este Pokemon?",
								buttons: [
									"Cancelar",
									{ text: "Borrar", handler: (d) => borrarPokemon(pokeuni) },
								],
							})
						}
					>
						Borrar
					</IonButton>
					<IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
				</IonModal>
				<IonList>{listItems}</IonList>
			</IonContent>
		</IonPage>
	);
};

export default Home;
