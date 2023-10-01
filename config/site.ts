export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Meteoro",
	description: "Meteoro - Um jeito fácil de monitorar o clima da sua casa",
	navItems: [
		{
			label: "Home",
			href: "/",
		}, 
		{
			label: "Previsão",
			href: "/previsao",
		},
		{
			label: "Mapa",
			href: "/mapa",
		}
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Mapa",
			href: "/mapa",
		},
		{
			label: "Previsão",
			href: "/previsao",
		}
	],
	links: {
		github: "https://github.com/freecorps/meteoro",
	},
};
