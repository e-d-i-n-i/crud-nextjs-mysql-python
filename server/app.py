from flask import Flask, jsonify, request
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from models import db, Users
from sqlalchemy.exc import SQLAlchemyError

# Initialize app and configurations
app = Flask(__name__)

# Application Config
app.config['SECRET_KEY'] = 'cairocoders-ednalan'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:GC)d<2Xa@localhost:3306/user_table'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

# Initialize extensions
CORS(app, supports_credentials=True)
db.init_app(app)
ma = Marshmallow(app)

# Create database tables
with app.app_context():
    db.create_all()

# Marshmallow Schema
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'email', 'password')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

# Routes
@app.route("/")
def home():
    return jsonify({"message": "Welcome to the User API"}), 200

@app.route('/users', methods=['GET'])
def list_users():
    try:
        all_users = Users.query.all()
        return jsonify(users_schema.dump(all_users)), 200
    except SQLAlchemyError as e:
        return jsonify({"error": str(e)}), 500

@app.route('/userdetails/<int:id>', methods=['GET'])
def user_details(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user_schema.dump(user)), 200

@app.route('/userupdate/<int:id>', methods=['PUT'])
def update_user(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({"error": "Name and email are required"}), 400

    try:
        user.name = name
        user.email = email
        db.session.commit()
        return jsonify(user_schema.dump(user)), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/userdelete/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/newuser', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400

    try:
        new_user = Users(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(user_schema.dump(new_user)), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
