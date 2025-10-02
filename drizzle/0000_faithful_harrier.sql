CREATE TABLE "players" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"nickname" text NOT NULL,
	"password" text NOT NULL,
	"cookies" text NOT NULL,
	"email" text NOT NULL,
	"level" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_players" (
	"user_id" integer NOT NULL,
	"player_id" integer NOT NULL,
	CONSTRAINT "user_players_user_id_player_id_pk" PRIMARY KEY("user_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" text NOT NULL,
	"username" text,
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
ALTER TABLE "user_players" ADD CONSTRAINT "user_players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_players" ADD CONSTRAINT "user_players_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE restrict ON UPDATE no action;