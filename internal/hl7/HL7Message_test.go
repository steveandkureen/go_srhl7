package hl7Messages

import (
	"fmt"
	"strings"
	"testing"
)

func TestParse(t *testing.T) {
	raw := "MSH|^~\\&|SMOut^SMOut^GUID|SCI^SCI^GUID|OFIn^OFIn^GUID|MainEntity^MainEntity^GUID|20080811115111||SIU^S12|SCI.2|P|2.3|\r\nSCH||TASKA17_1a^SCI^SCI|||||CPT1^task 1|STAT|30.00|Min|^^^20081013083000|||||||||||||APPTA17_1^SCI^SCI|S\r\nNTE|1|A|Appointment Notes A17_1a\r\nNTE|2|Q|Order Question and Answer A17_1a\r\nPID|1||EEA17_1^^^MainEntity^EE~MRA17_1^^^MainEntity^MR||PALA17_1^PAFA17_1^^^^^legal||19710101000000|M|PALA17_1^PAFA17_1^M^^^^A||111, First Avenue^#111^Tucson^AZ^85718^USA^home~222, Second Avenue^#222^Tucson^AZ^85742^USA^W||(111)111-1111^home|(222)222-2222^work|||||999999901|20081007A17_1\r\nDG1|1||278.01^278.01^I9||||||||||||0\r\nDG1|2||425.8^425.8^I9||||||||||||0\r\nDG1|3||E66.01^E66.01^I10||||||||||||0\r\nDG1|4||E11.311^E11.311^I10||||||||||||0\r\nRGS|1\r\nAIP|1||White|200|||0.00|MIN|30.00|MIN\r\nIN1|1|PLAN1|PAYOR1|INTEGRATION TEST PAYOR|123, Broadway Blvd.^#123^Tucson^AZ^12345^USA^W||(123)456-7890^work|GA17_1|||||||MED|PALA17_1^PAFA17_1^^^^^legal~PALA17_1^PAFA17_1^M^^^^L|SELF|19710101000000|111, First Avenue^#111^Tucson^AZ^85718^USA^home~222, Second Avenue^#222^Tucson^AZ^85742^USA^W|||1||||||||||||||PA17_1|||||||F||||||EEA17_1^^^MainEntity^EE~MRA17_1^^^MainEntity^MR\r\nIN2|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||MEMBERA17_1||\r\nZIN|1||||Patient: PALA17_1        DOB: 01/01/1971        Recovery: 90% {+-5%}\r\nZAR|1|A17_1a||||20151010000000|||||10|||||||||||||FNL|Completed A17_1a~END|http://www.scisolutions.com|TASKA17_1a^SCI^SCI~TASKA17_1b^SCI^SCI~TASKA17_1c^SCI^SCI\r\nZMN|1|P|20080901000000\r\nZOR|1|AO||FMD^L_FromDoctor1^F_FromDoctor1^^^^^^MainEntity^^^^DN|Physician1||MainFacility^Main Facility~MD1^mainToDoctor1^Doctor^^^^^^MainEntity^^^^DN|APPDA17_1^SCI|Headache|20090310214031||CPT1^^^MainEntity~CPT1-AA2^^^AA2\r\nZP1|||||||Y\r\nZP2||PID^1|AF~CA~OTHER"
	msg, err := ParseMessage(raw)
	if err != nil {
		t.Fatalf(err.Error())
	}
	out := strings.Trim(msg.String(), "\r\n")

	if out != raw {
		t.Fatalf("Out put does not match \r\n" + out + "\r\n\r\n" + raw)
	}

}

func TestMSH(t *testing.T) {
	raw := "MSH|^~\\&|SMOut^SMOut^GUID|SCI^SCI^GUID|OFIn^OFIn^GUID|MainEntity^MainEntity^GUID|20080811115111||SIU^S12|SCI.2|P|2.3|\r\nSCH||TASKA17_1a^SCI^SCI|||||CPT1^task 1|STAT|30.00|Min|^^^20081013083000|||||||||||||APPTA17_1^SCI^SCI|S\r\nNTE|1|A|Appointment Notes A17_1a\r\nNTE|2|Q|Order Question and Answer A17_1a\r\nPID|1||EEA17_1^^^MainEntity^EE~MRA17_1^^^MainEntity^MR||PALA17_1^PAFA17_1^^^^^legal||19710101000000|M|PALA17_1^PAFA17_1^M^^^^A||111, First Avenue^#111^Tucson^AZ^85718^USA^home~222, Second Avenue^#222^Tucson^AZ^85742^USA^W||(111)111-1111^home|(222)222-2222^work|||||999999901|20081007A17_1\r\nDG1|1||278.01^278.01^I9||||||||||||0\r\nDG1|2||425.8^425.8^I9||||||||||||0\r\nDG1|3||E66.01^E66.01^I10||||||||||||0\r\nDG1|4||E11.311^E11.311^I10||||||||||||0\r\nRGS|1\r\nAIP|1||White|200|||0.00|MIN|30.00|MIN\r\nIN1|1|PLAN1|PAYOR1|INTEGRATION TEST PAYOR|123, Broadway Blvd.^#123^Tucson^AZ^12345^USA^W||(123)456-7890^work|GA17_1|||||||MED|PALA17_1^PAFA17_1^^^^^legal~PALA17_1^PAFA17_1^M^^^^L|SELF|19710101000000|111, First Avenue^#111^Tucson^AZ^85718^USA^home~222, Second Avenue^#222^Tucson^AZ^85742^USA^W|||1||||||||||||||PA17_1|||||||F||||||EEA17_1^^^MainEntity^EE~MRA17_1^^^MainEntity^MR\r\nIN2|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||MEMBERA17_1||\r\nZIN|1||||Patient: PALA17_1        DOB: 01/01/1971        Recovery: 90% {+-5%}\r\nZAR|1|A17_1a||||20151010000000|||||10|||||||||||||FNL|Completed A17_1a~END|http://www.scisolutions.com|TASKA17_1a^SCI^SCI~TASKA17_1b^SCI^SCI~TASKA17_1c^SCI^SCI\r\nZMN|1|P|20080901000000\r\nZOR|1|AO||FMD^L_FromDoctor1^F_FromDoctor1^^^^^^MainEntity^^^^DN|Physician1||MainFacility^Main Facility~MD1^mainToDoctor1^Doctor^^^^^^MainEntity^^^^DN|APPDA17_1^SCI|Headache|20090310214031||CPT1^^^MainEntity~CPT1-AA2^^^AA2\r\nZP1|||||||Y\r\nZP2||PID^1|AF~CA~OTHER"

	response, err := CreateAck(raw, AA)
	if err != nil {
		t.Fatalf(err.Error())
	}

	if len(response) == 0 {
		t.Fatalf("Response not correct: " + response)
	}

	fmt.Println(response)

}
