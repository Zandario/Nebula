
/client/proc/devtools()
	set category = "Debug"
	set name = "Dev Tools"
	set desc = "Enabled webview2 dev tools"

	winset(src, null, "browser-options=find,devtools")
	message_admins("[key_name_admin(usr)] has enabled Dev Tools.")
