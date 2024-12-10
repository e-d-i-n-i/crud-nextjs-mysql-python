from flask import Flask, jsonify, request
from flask_marshmallow import Marshmallow 
from flask_cors import CORS, cross_origin 
from models import db, Users

app = Flask(__name__)


app.config['SECRET_KEY'] = 'cairocoders-ednalan'
# Databse configuration mysql                             Username:password@hostname/databasename
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:GC)d<2Xa@localhost:3306/user_table'
                                                        
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = True

CORS(app, supports_credentials=True)
 
db.init_app(app)
        
with app.app_context():
    db.create_all()


ma=Marshmallow(app)
 
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id','name','email','password')
  
user_schema = UserSchema()
users_schema = UserSchema(many=True)

@app.route("/")
def hello():
    return "Hello World"


@app.route('/users', methods=['GET']) 
def listusers():
    all_users = Users.query.all()
    results = users_schema.dump(all_users)
    return jsonify(results)

@app.route('/userdetails/<id>',methods =['GET'])
def userdetails(id):
    user = Users.query.get(id)
    return user_schema.jsonify(user)

@app.route('/userupdate/<id>',methods = ['PUT'])
def userupdate(id):
    user = Users.query.get(id)
  
    name = request.json['name']
    email = request.json['email']
  
    user.name = name
    user.email = email
  
    db.session.commit()
    return user_schema.jsonify(user)

@app.route('/userdelete/<id>',methods=['DELETE'])
def userdelete(id):
    user = Users.query.get(id)
    db.session.delete(user)
    db.session.commit()
    return user_schema.jsonify(user)

@app.route('/newuser',methods=['POST'])
def newuser():
    name = request.json['name']
    email = request.json['email']
    password = request.json['password']
  
    print(name)
    print(email)
    print(password)
 
    users = Users(name=name, email=email, password=password)
 
    db.session.add(users)
    db.session.commit()
    return user_schema.jsonify(users)

if __name__ == "__main__":
    app.run(debug=True)