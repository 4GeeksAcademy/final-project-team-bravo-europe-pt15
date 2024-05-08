import os
from flask import jsonify, url_for
from flask_mail import Message, Mail
from flask import url_for

mail = Mail()

class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"


def send_password_reset_email(email, token):
    try:
        # Construct the password reset URL with the frontend URL and token
        frontend_url = "https://opulent-space-giggle-6qgw6w9g7qpfxx64-3000.app.github.dev"
        reset_url = f"{frontend_url}/reset-password?token={token}"
        
        msg = Message(
            subject='Password Reset Request', 
            sender=os.getenv("my_email"),
            recipients=[email]
        )
        msg.body = f"You got this email because someone requested a password reset for {email}. Please use the following link to reset your password: {reset_url}"
        mail.send(msg)
        return "Message sent!"
    except Exception as e:
        error_message = f"Failed to send password reset email: {str(e)}"
        print(error_message)  # Log the error for debugging
        return False, error_message  # Email sending failed, return error message
