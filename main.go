package main

import (
	"html/template"
	"net/http"
)

type Page struct {
	Title string
}

func rootHandler(w http.ResponseWriter, r *http.Request) {
	p := &Page{Title: "Your title"}
	t, _ := template.ParseFiles("templates/index.html")
	t.Execute(w, p)
	//http.ServeFile(w, r, "templates/index.html")
}

func main() {
	// inside this will execute all file include are js and css
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))

	http.HandleFunc("/", rootHandler)
	http.ListenAndServe(":8080", nil)
}
