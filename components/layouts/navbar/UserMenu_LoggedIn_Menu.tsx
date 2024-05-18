import React from "react";

import { signOut, useSession } from "next-auth/react";

import IconEmbedSvg from "@/components/fragments/IconEmbedSvg";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenu_NextLink_Styled,
} from "@/components/ui/navigation-menu";
import { Route } from "@/routes";

import { msgs } from "@/messages";

import RevalidatePaths from "@/components/fragments/RevalidatePaths";

import styles from "./_navbar.module.scss";

interface Props {
	className?: string;
}

const LoggedIn_Menu: React.FC<Props> = ({ className = "-mr-4" }) => {
	const t = msgs("Navigation");
	const { data: session } = useSession();

	type tType = Parameters<typeof t>[0];

	return (
		<div className="flex flex-row">
			<NavigationMenu
				className={`${styles.loggedInMenu} ${className}`}
				viewportPosition="-right-16"
			>
				<NavigationMenuList>
					<NavigationMenuItem>
						<NavigationMenuTrigger
							chevronLeft
							aria-label={t("loggedInUserMenu")}
							className="text-accent-secondary active:text-accent-secondary focus:text-accent-secondary focus-visible:text-accent-secondary"
						>
							<IconEmbedSvg type="sidebar-flip" />
						</NavigationMenuTrigger>

						<NavigationMenuContent className="w-64 3xs:w-[22rem] 2xs:w-96">
							<div className="3xs:columns-2 border-b-2 border-b-primary pb-1 mb-1">
								{Object.keys(Route.admin).map((key) => (
									<NavigationMenu_NextLink_Styled
										key={key}
										className={styles.userMenuItem}
										desc={t(`${key}_DESC` as tType)}
										href={Route.admin[key as keyof typeof Route.admin]}
										title={t(key as tType)}
									/>
								))}
							</div>

							<div className="3xs:columns-2">
								<div className={styles.userMenuItem}>
									<p className="font-bold">
										{t("user")} ({session?.user?.accountProvider})
									</p>
									<p className="text-foreground-tertiary">{session?.user?.name}</p>
								</div>

								<NavigationMenu_NextLink_Styled
									className={styles.userMenuItem}
									desc={t("signOutDescription")}
									href="#"
									title={t("signOut")}
									onClick={(e) => {
										e.preventDefault();
										signOut();
									}}
								/>
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>

			<RevalidatePaths className="scale-[85%] -mr-2 ml-1 " />
		</div>
	);
};

export default LoggedIn_Menu;
