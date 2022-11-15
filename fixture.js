const mongoose = require('mongoose');
const userModel = require('./Model/userModel');
const communeModel = require('./Model/communeModel');
const activityModel = require('./Model/activityModel')
const paymentModel = require('./Model/paymentModel');
const adminModel = require('./Model/adminModel');
const bcrypt = require('bcryptjs');

// connect to database

mongoose.connect("mongodb://localhost:27017/community-tax", { useNewUrlParser: true }, { useUnifiedTopology: true }, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("I'm connected to the database")
    }
})

// create activity collection 

const addActivity = async () => {

    try {

        await activityModel.deleteMany({}).lean()

        await activityModel.insertMany([

            {
                name: "bijoutier",
                prix: 10
            },
            {
                name: "coiffeur",
                prix: 15
            },
            {
                name: "electricien",
                prix: 20
            },
            {
                name: "cuisinier",
                prix: 15
            },
            {
                name: "cordonnier",
                prix: 13
            },
            {
                name: "pharmacien",
                prix: 25
            },
            {
                name: "mécanicien",
                prix: 15
            },
            {
                name: "plombier",
                prix: 20
            },
            {
                name: "technicien",
                prix: 25
            },
            {
                name: "vendeur",
                prix: 18
            }
        ])

        console.log("The collection of Activity has being recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create activity collection 

const addCommune = async () => {

    try {

        await communeModel.deleteMany({}).lean()

        await communeModel.insertMany([

            {
                name: "Abene",
                information: "Abéné (also called Abene, Abémé, or Abeme) is a village in the rural community of Kafountine, Kataba Arrondissement, Bignona Department, Ziguinchor Region, in the Basse Casamance area of south-west Senegal. It is located on the Atlantic coast.  The nearest towns are Folonko, Allahein, Niafourang, Kabadio, Kérouané, Albreda, Kafountine, and Diana."
            },
            {
                name: "Bademe",
                information: "Badème is a village in the rural community of Nyassia, Nyassia Arrondissement, Ziguinchor Department in the Ziguinchor Region of south-west Senegal, near the border with Guinée-Bissau. Nearby villages include Bassèré, Kadiene, Goudoume, Atoure, Toubacouta, Babonda, Djililo and Bagame.  According to PEPAM (Programme d'eau potable et d'assainissement du Millénaire), Badème has a population of 646 people living in 90 houses."
            },
            {
                name: "Bambey",
                information: "Bambey is a town of commune status located in the Diourbel Region of Senegal.  The town lies on the N3 road connecting it to Dakar and is also served by a mainline station on the Dakar-Niger Railway."
            },
            {
                name: "Dagana",
                information: "Dagana is a town situated in the Saint-Louis Region of Senegal and it is the capital of the Dagana Department. Dagana shares its border with Mauritania. The different ethnic groups in Dagana include Wolof, Fula and Moor."
            },
            {
                name: "Khombole",
                information: "Khombole is a town in the Thiès Region of Senegal. It is in the Thiès Department. The population in 2012 was 12,880, an increase from the 11,574 counted in 2002. Pape Mandialbere Mboup was elected mayor in 2014."
            },
            {
                name: "Lydiane",
                information: "Lydiane is a town in east central Senegal in Kaolack region. It is the terminus of a branchline off the main Dakar-Niger Railway from Guinguinéo."
            },
            {
                name: "Mboro",
                information: "Mboro is a town in the Thiès Region of western Senegal. It is in the Tivaouane Department. The population in 2013 was 27,693. The town received commune status in 2002. Mboro is situated 25 km west of Tivaouane and 117 km north of Dakar. There is a phosphate mine and factory in Mboro."
            },
            {
                name: "Ngazobil",
                information: "Since the 19th century, Ngazobil has housed a Catholic mission, one of the oldest in Senegal, established by François Libermann of Saverne, founder of the Congregation of The Holy Spirit. Louis-Philippe Walter stayed there in 1867. It was also in Ngazobil that future president Léopold Sédar Senghor did his schooling until 1922. Hyacinthe Thiandoum was trained there as well. Saint-Joseph Seminary was classified as a historical monument in 2003. Ngazobil is now a common site for pilgrimages."
            },
            {
                name: "Pikine",
                information: "Pikine is a city in the Pikine Department of the Dakar Region of Senegal. Lying to the east of Dakar city centre, at the 2013 Census it had a population of 1,170,791. The department includes the villages of Yeumbeul, Thiaroye, Mbao, and Keur Massar Malika. Until the mid-2000s, it also included Guédiawaye, which now forms a separate Department. The city was founded in 1952 by the colonial government for former residents of Dakar who were relocated for new developments. This original city is now known as <<Old Pikine>>, while an informal community has grown up around it. The Grande Niaye de Pikine, a green area known for market gardening, lies to the north west of Pikine."
            },
            {
                name: "Podor",
                information: "Podor (Wolof: Podoor) is the northernmost town in Senegal, lying on Morfil Island between the Sénégal River and Doué River on the border with Mauritania. It was the location of the ancient state Takrur. It is home to a ruined French colonial fort, built in 1854 as a centre for gold trading, and is the birthplace of fashion designer Oumou Sy, as well as musicians Baaba Maal and Mansour Seck. The 2002 census determined the population of the town was 9,472 inhabitants.[citation needed] In 2007, according to official estimates, it had grown to 11,869. It is 99% Muslim."
            },
            {
                name: "Richard Toll",
                information: "Richard Toll is a town in northern Senegal, lying on the south bank of the River Senegal, just east of Rosso. Originally a colonial town, it was named for the park of the Château de Baron Roger, laid out by botanist Jean Michel Claude Richard. A rice-growing scheme was originally initiated by France's colonial development organisation, FIDES, in 1949 with an initial cultivated area of 6,000 hectares (14,830 acres). The town's main industry is sugar. The estimated population in 2007 was 70,000."
            },
            {
                name: "Segou",
                information: "Segou is a village in the Kédougou Region of south-eastern Senegal at 12.41 degrees N latitude and 12.28 degrees W longitude. It is 25 km from the region capital of Kédougou and 120 km from Niokolo-Koba National Park. It is in the foothills of the Guinea mountains. It has a population of about 1,000. Nearly all of the people of the village are Pula Futa."
            },
            {
                name: "Sokone",
                information: "La commune du Pré-Saint-Gervais est située en première couronne de l'agglomération parisienne, au nord-est de Paris, et au sud du département de la Seine-Saint-Denis. Elle est limitrophe au sud et à l'ouest de Paris, au nord et au nord-est de Pantin, et à l'est et au sud des Lilas. La commune est édifiée sur le flanc nord de la colline de Belleville. Le Pré-Saint-Gervais est, en superficie, la plus petite commune du département de la Seine-Saint-Denis, avec seulement 70 hectares. C'est d'autre part la commune de Seine-Saint-Denis avec la plus forte densité, et l'une les plus densément peuplées de France avec plus de 25 000 habitants au km². Elle est ainsi la dixième ville la plus densément peuplée du monde. La commune est longée par le boulevard périphérique de Paris et desservie par les sorties porte du Pré-Saint-Gervais (sortie chaussée intérieure), porte des Lilas ou encore porte de Pantin. De plus, la porte Chaumont lie Paris au Pré-Saint-Gervais mais sans accès au périphérique. De même, le passage Brunet permet les accès piétons sous le périphérique au niveau de la porte Brunet."
            },
            {
                name: "Thiadiaye",
                information: "Sokone is a town in the Fatick Region of central Senegal. Sokone is a tranquil town on the south-eastern Sine-Saloum Delta amid the mangroves. It is located on the N5 road from Kaolack to Banjul, 50 km south of Kaolack and 66 km north of Banjul. During the colonial period, the town was a peanut port and the old warehouses can still be seen around town along with a large number of peanut fields in the surrounding country side. Along with peanuts, millet, cashews, and many fruits and vegetables are grown. Agriculture and fishing continue to be the main economic activities in the area. The main ethnic group in the area is the Sereer people, followed by the Wolof, Pulaars, and Mandinkas. The Wolof and Sereer languages are the most commonly heard languages, but many people in the town speak French as well. In 2013, according to official estimates, Sokone had a population of some 14,500. The town received commune status in 1996. It is on the national route N1, between M'bour and Fatick."
            },
            {
                name: "Thiaroye",
                information: "Thiaroye (or Tiaroye) is the name of a historic town in Sénégal, situated in the suburbs of Dakar, on the southeast coast of the Cap-Vert peninsula, between Pikine and Rufisque.  Since the administrative reform in 1996, Thiaroye has been divided into independent communes, Thiaroye-Gare, Thiaroye-sur-Mer and Thiaroye-Kao (or Djiddah Thiaroye Kao), with Guinaw-Rail Nord, Guinaw-Rail Sud (both to the west), and Tivaouane-Diacksao (to the east) split off and separating Thiaroye-sur-Mer from the other two inland communes."
            },
            {
                name: "Vélingara",
                information: "Vélingara is a town located in the Kolda Region of Senegal. It is slightly north of the large 48 km Vélingara crater though the structure's impact origin is still unconfirmed. The population is primarily composed of Fulani, Soninke, Wolof and Madingo. At the census of 2002 it numbered 20,806. In 2007, according to official estimates, it had grown to 23,775."
            },
            {
                name: "Yaboyabo",
                information: "Linked to Serer mythology and religion and deemed one of the Serer holy sites, Yaboyabo is one of the oldest villages in Senegal. According to the Serer creation myth, Yaboyabo takes its name from the first human couple (YAAB and YOP, var : YAAB and YOB) created by the supreme being Roog (or Koox among the Cangin). The narrative went on to state that, the original twins (female and male respectively) were carried from the Empyrean Heaven by an ark. This is believed to be deposited in the sacred village of Yaboyabo. Although the ark of Yaabo-Yabo is an ancient relic under the guardianship of this Serer village, and ritually venerated by those who adhere to the tenets of Serer religion, it is highly unlikely to be the original <<ark>> and was probably an ancient replica. Many Serer homes have ancient artifacts, some of which are religious in nature (see Serer ancient history)."
            }
        ])

        console.log("The collection of Commune has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create user collection 

const addUser = async () => {

    const password = "!As123456"
    const passwordHash = bcrypt.hashSync(password)

    try {

        const communeDetails = await communeModel.findOne({ name: "Abene" }).lean()     // take commune id to save in with user collection
        
        const activityDetails = await activityModel.findOne({ name: "cuisinier" }).lean()  // take activity id to save in with user collection
        
        await userModel.deleteMany({}).lean()

        await userModel.insertMany([

            {
                surname: "mille",
                firstname: "john",
                dateofbirth: "2000/12/12",
                email:"millejohn@msn.com",
                address_personal: "1010 boulevard champs elysee, paris 75052",
                address_activity: "5 Avenue Abdoulaye Fadiga x Parchappe, Dakar, Senegal",
                activity_communeID: communeDetails._id,
                activityID: activityDetails._id,
                telephone: "148381111",
                password: passwordHash,
                status: "inactive"

            }
        ])

        console.log("The collection of User has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create admin collection

const addAdmin = async () => {

    const password = "!As123456"
    const passwordHash = bcrypt.hashSync(password)

    try {

        await adminModel.deleteMany({}).lean()

        await adminModel.insertMany([

            {
                firstname: "zaine",
                surname: "zulu",
                role: "1",
                telephone: "248382222",
                email:"zainesulu@gmail.sa",
                password: passwordHash,
                status: "active"

            },
            {
                firstname: "truman",
                surname: "shelly",
                role: "2",
                telephone: "348383333",
                email:"trumanshelly@abi.ca",
                password: passwordHash,
                status: "active"


            },
            {
                firstname: "odilia",
                surname: "bonhomme",
                role: "2",
                telephone: "448384444",
                email:"odillabh@sauf.fr",
                password: passwordHash,
                status: "active"


            }

        ])

        console.log("The collection of admin has been recreated with the database");

    } catch (err) {
        console.log(err)
    }
}

// create payment collection

const addPayment = async () => {
    
    try {
        
        const defaultUser = "148381111";    // user signed in telephone number
        
        const userDetails = await userModel.findOne({ telephone: defaultUser }).lean()     // take commune id to save in with user collection
         
        await paymentModel.deleteMany({}).lean()
        
        await paymentModel.insertMany([
            
            {
                userId: userDetails._id,
                telephone: userDetails.telephone,
                amount: "11.55",
                comments: "Frais d'inscription",
                paidon: new Date()
            }
        ])
        
        console.log("The collection of Payment has been recreated with the database");
        
        
    } catch (err) {
        console.log(err)
    }
}


addActivity();

addCommune();

setTimeout(function () { addAdmin() }, 3000);        // will wait to get updated activity/commune collection to avoid promise error;

setTimeout(function () { addUser() }, 3000);        // will wait to get updated activity/commune collection to avoid promise error

setTimeout(function () { addPayment() }, 7000 );     // delay is to avoid any error collection
