import React, {PureComponent} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Button from './components/Button';
import stripe from 'tipsi-stripe';
import axios from 'axios';

stripe.setOptions({
  publishableKey: 'pk_test_5k5QypicUSsWOYYnbRR4Zlx200YAVjQPPv',
});

export default class CardFormScreen extends PureComponent {
  static title = 'Card Form';

  state = {
    loading: false,
    token: null,
  };

  handleCardPayPress = async () => {
    try {
      this.setState({loading: true, token: null});
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Rob',
            line1: 'Chill ave.',
            line2: '5',
            city: 'Santa Monica',
            state: 'California',
            country: 'US',
            postalCode: '90210',
            email: 'rob@chartbot.io',
          },
        },
      });

      this.setState({loading: false, token});
    } catch (error) {
      this.setState({loading: false});
    }
  };

  makePayment = async () => {
    this.setState({loading: true});

    axios({
      method: 'POST',
      url:
        'https://us-central1-easymember-stripe.cloudfunctions.net/completePaymentWithStripe',
      data: {
        amount: 100,
        currency: 'usd',
        token: this.state.token,
      },
    }).then(response => {
      console.log(response);
      this.setState({loading: false});
    });
  };

  render() {
    const {loading, token} = this.state;

    return (
      <ScrollView style={{backgroundColor: '#147efb'}}>
        <View style={styles.containerHeader}>
          <Text style={styles.header}>Easy Member</Text>
          <Text style={styles.subheading}>Collect subscription payments</Text>
          <Button
            text="Subscribe"
            loading={loading}
            onPress={this.handleCardPayPress}
            style={{backgroundColor: 'white'}}></Button>

          <View style={styles.token}>
            {token && (
              <>
                <Text style={styles.instruction}>Token: {token.tokenId}</Text>
                <Button
                  text="Submit Payment"
                  loading={loading}
                  onPress={this.makePayment}
                  style={{backgroundColor: 'white'}}
                />
              </>
            )}
          </View>
        </View>

        {/* <View style={styles.container}>
          <Text style={styles.header}>Try it out</Text>
          <Text style={styles.header}>1. Create Subscription</Text>
          <Text style={styles.subheading}>Collect subscription payments</Text>
        </View> */}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#147efb',
  },
  containerHeader: {
    paddingTop: '50%',
    //paddingBottom: '30%',
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
  },
  subheading: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
    height: 30,
  },
  instruction: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
    height: 30,
  },
  token: {
    height: 20,
  },
});
