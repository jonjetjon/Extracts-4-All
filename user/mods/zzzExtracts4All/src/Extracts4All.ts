import type { DependencyContainer } from "tsyringe"
import type { ILogger } from "@spt-aki/models/spt/utils/ILogger"
import type { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod"
import type { DatabaseServer } from "@spt-aki/servers/DatabaseServer"

class Extracts4All implements IPostDBLoadMod
{
  private container: DependencyContainer
  private config = require("../config/config.json")
  private logger :ILogger
  private loggerBuffer :string[] = []
  
  private debug = false

  private customsEnabled = false
  private interchangeEnabled = false
  private shorelineEnabled = false
  private woodsEnabled = false
  private lighthouseEnabled = false
  private streetsEnabled = false
  private groundZeroEnabled = false
  public postDBLoad(container :DependencyContainer):void
  {
    this.container = container
    this.logger = this.container.resolve<ILogger>("WinstonLogger")
    const quests = this.container.resolve<DatabaseServer>("DatabaseServer").getTables().templates.quests
    const DB = container.resolve("DatabaseService").getTables();
    const locations = DB.locations;
    //go through each option in the config.json and handle known ones
    for (let eachOption in this.config)
    {
      if (this.config[eachOption] != false)
      {
        switch (eachOption)
        {
          case 'debug':
            this.debug = true
            break

          case 'ReplacePMCWithAll':
            this.replacePmc = true
            break
          
          case 'HarderPMCWithAll':
            this.harderPmc = true
            break
        }
      }
    }
    for (let map in locations) {
      switch (map) {
       case "base":
        break;
       case "bigmap":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "Customs,Boiler Tanks"
        }
        break;
       case "interchange":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "MallSE,MallNW"
        }
        break;
       case "shoreline":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "Village,Riverside"
        }
        break;
       case "woods":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "House,Old Station"
        }
        break;
       case "lighthouse":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "Tunnel,North"
        }
        break;
       case "tarkovstreets":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "E1_2,E6_1,E2_3,E3_4,E4_5,E5_6,E6_1"
        }
        break;
       case "sandbox":
       case "sandbox_high":
        for (const extract in locations[map].base.exits) {
         locations[map].base.exits[extract].EntryPoints = "west,east"
        }
        break;
 
       default:
        break;
      }
     }
    
  }
}

module.exports = {mod: new Extracts4All()}